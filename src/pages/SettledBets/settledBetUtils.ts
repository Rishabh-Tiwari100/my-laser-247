import type { ProfitLossItem } from '@/store/api/betReportApi';
import dayjs from 'dayjs';
import type { SettledBetRow, SettledEventGroup, SettledBetSide, SettledBetStatus } from './types';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asText = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
};

const firstText = (...values: unknown[]): string => {
  for (const value of values) {
    const text = asText(value);
    if (text) return text;
  }
  return '';
};

const asFiniteNumber = (value: unknown): number | undefined => {
  const text = asText(value).replace(/,/g, '');
  if (!text) return undefined;

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatNumber = (value: unknown, fallback = '-'): string => {
  const numericValue = asFiniteNumber(value);
  if (numericValue === undefined) return firstText(value) || fallback;

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 5,
    useGrouping: false,
  }).format(numericValue);
};

const formatTimestamp = (value: unknown): string => {
  const rawValue = firstText(value);
  if (!rawValue) return '-';

  const parsed = dayjs(rawValue);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm:ss') : rawValue;
};

const normalizeSide = (value: unknown): SettledBetSide =>
  firstText(value).toUpperCase() === 'LAY' ? 'LAY' : 'BACK';

const getCalculatedProfit = (
  bet: ProfitLossItem,
  side: SettledBetSide,
  odds: number | undefined,
  stake: number | undefined
): string => {
  const explicit = firstText(bet.potentialProfit, bet.profit, bet.profitLoss, bet.pl, bet.payout);
  if (explicit) return formatNumber(explicit);
  if (stake === undefined) return '-';

  if (side === 'LAY') return formatNumber(stake);
  if (odds === undefined) return '-';
  return formatNumber(Math.max(0, odds - 1) * stake);
};

const getCalculatedLiability = (
  bet: ProfitLossItem,
  side: SettledBetSide,
  odds: number | undefined,
  stake: number | undefined
): string => {
  const explicit = firstText(bet.liability, bet.risk, bet.exposure);
  if (explicit) return formatNumber(explicit);
  if (stake === undefined) return '-';

  if (side === 'BACK') return formatNumber(stake);
  if (odds === undefined) return '-';
  return formatNumber(Math.max(0, odds - 1) * stake);
};

const getProfitLoss = (bet: ProfitLossItem): number => {
  const explicitProfitLoss = asFiniteNumber(
    bet.profitLoss ?? bet.pl ?? bet.payout ?? bet.netProfitLoss ?? bet.net
  );
  if (explicitProfitLoss !== undefined) return explicitProfitLoss;

  const totalWins = asFiniteNumber(bet.totalWins);
  const totalBets = asFiniteNumber(bet.totalBets);
  if (totalWins !== undefined || totalBets !== undefined) {
    return (totalWins ?? 0) - (totalBets ?? 0);
  }

  return 0;
};

const getSettledStatus = (bet: ProfitLossItem, profitLoss: number): SettledBetStatus => {
  const status = firstText(bet.status).toLowerCase();
  if (status.includes('won') || status.includes('win')) return 'Won';
  if (status.includes('lost') || status.includes('loss')) return 'Lost';
  if (status.includes('rollback') || status.includes('rollback')) return 'Rollback';
  if (status.includes('Cancelled') || status.includes('cancelled')) return 'Cancelled';
  return profitLoss >= 0 ? 'Won' : 'Lost';
};

const getEventRecord = (bet: ProfitLossItem): UnknownRecord =>
  isRecord(bet.event) ? bet.event : {};

const getEventName = (bet: ProfitLossItem, event: UnknownRecord): string =>
  firstText(event.name, bet.eventName, bet.matchName, bet.event) || 'Unknown Event';

const getEventStart = (bet: ProfitLossItem, event: UnknownRecord): string =>
  formatTimestamp(
    firstText(
      event.startTime,
      event.startsAt,
      event.openDate,
      event.time,
      bet.eventStartTime,
      bet.marketStartTime,
      bet.eventDate,
      bet.settledAt,
      bet.placedAt,
      bet.createdAt
    )
  );

const getEventKey = (
  bet: ProfitLossItem,
  event: UnknownRecord,
  eventName: string,
  eventStart: string
): string => firstText(event.id, bet.eventId, bet.matchId) || `${eventName}-${eventStart}`;

const getCashoutBadge = (bet: ProfitLossItem): boolean => {
  const status = firstText(bet.status).toUpperCase();
  return Boolean(
    bet.isCashOut ||
    bet.isCashout ||
    bet.cashOut ||
    bet.cashout ||
    bet.isCancelled ||
    status === 'CASHOUT' ||
    status === 'CASHED_OUT'
  );
};

const toSettledBetRow = (bet: ProfitLossItem, index: number): SettledBetRow => {
  const side = normalizeSide(bet.betOn);
  const rawOdds = firstText(bet.odds, bet.rate);
  const rawStake = firstText(bet.amount, bet.stake);
  const odds = asFiniteNumber(rawOdds);
  const stake = asFiniteNumber(rawStake);
  const profitLoss = getProfitLoss(bet);

  return {
    id: firstText(bet.id) || `settled-bet-${index}`,
    market: firstText(bet.marketName, bet.market, bet.marketType) || '-',
    selection: firstText(bet.selection, bet.selectionName, bet.runnerName) || '-',
    odds: formatNumber(rawOdds),
    stake: formatNumber(rawStake),
    placedAt: formatTimestamp(
      firstText(bet.placedAt, bet.betPlacedAt, bet.createdAt, bet.settledAt)
    ),
    // rate: firstText(bet.percentage, bet.userRate) || '-',
    rate: formatNumber(rawOdds) || '-',
    profit: getCalculatedProfit(bet, side, odds, stake),
    liability: getCalculatedLiability(bet, side, odds, stake),
    profitLoss,
    status: getSettledStatus(bet, profitLoss),
    side,
    showCashoutBadge: getCashoutBadge(bet),
  };
};

export const groupSettledBets = (bets: ProfitLossItem[]): SettledEventGroup[] => {
  const groups = new Map<string, SettledEventGroup>();

  bets.forEach((bet, index) => {
    const event = getEventRecord(bet);
    const name = getEventName(bet, event);
    const startsAt = getEventStart(bet, event);
    const id = getEventKey(bet, event, name, startsAt);
    const existing = groups.get(id);

    if (existing) {
      existing.bets.push(toSettledBetRow(bet, index));
      return;
    }

    groups.set(id, {
      id,
      name,
      startsAt,
      bets: [toSettledBetRow(bet, index)],
    });
  });

  return Array.from(groups.values());
};

export const formatFilterDate = (date: string): string => {
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY') : date;
};
