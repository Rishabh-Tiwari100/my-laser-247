import type { Transaction } from '@/store/api/transactionApi';
import dayjs from 'dayjs';
import type {
  ProfitLossBet,
  ProfitLossEventGroup,
  ProfitLossLedgerRow,
  ProfitLossMarketType,
  ProfitLossSportGroup,
} from './types';

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
    const textValue = asText(value);
    if (textValue) return textValue;
  }
  return '';
};

const asFiniteNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  const normalizedValue = asText(value).replace(/,/g, '');
  if (!normalizedValue) return undefined;
  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'other';

const getSport = (value: unknown, fallbackSport: string) => {
  const apiSport = firstText(value, fallbackSport, 'Other');
  const normalizedSport = apiSport.toLowerCase();
  const label =
    normalizedSport === 'football' || normalizedSport === 'soccer'
      ? 'SOCCER'
      : apiSport.toUpperCase();

  return {
    apiSport: normalizedSport === 'football' ? 'Soccer' : apiSport,
    id: slugify(label),
    label,
  };
};

const getMarketType = (bet: UnknownRecord): ProfitLossMarketType => {
  if (bet.isBookmaker === true) return 'Bookmaker Market';
  const marketDescriptor = firstText(
    bet.marketType,
    bet.marketCategory,
    bet.marketName
  ).toLowerCase();
  if (marketDescriptor.includes('bookmaker')) return 'Bookmaker Market';
  if (marketDescriptor.includes('fancy') || marketDescriptor.includes('session')) {
    return 'Fancy Market';
  }
  return 'Main Market';
};

const getProfitLoss = (bet: UnknownRecord): number => {
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

export const normalizeApiProfitLossBets = (
  bets: readonly unknown[],
  fallbackSport = ''
): ProfitLossBet[] =>
  bets.flatMap((rawBet, index) => {
    if (!isRecord(rawBet)) return [];

    const event = isRecord(rawBet.event) ? rawBet.event : {};
    const sport = getSport(rawBet.sport, fallbackSport);
    const eventName =
      firstText(event.name, rawBet.eventName, rawBet.matchName, rawBet.gameName, rawBet.event) ||
      'Unknown Event';
    const eventId =
      firstText(event.id, rawBet.eventId, rawBet.matchId, rawBet.roundId) || slugify(eventName);
    const settledAt = firstText(
      rawBet.settledAt,
      rawBet.createdAt,
      rawBet.placedAt,
      event.startTime,
      event.startsAt,
      event.openDate,
      event.time
    );
    const eventDate = firstText(
      rawBet.settledAt,
      event.startTime,
      event.startsAt,
      event.openDate,
      event.time,
      rawBet.createdAt,
      rawBet.placedAt
    );
    const marketName = firstText(rawBet.marketName, rawBet.market, rawBet.marketType) || '-';
    const selection =
      firstText(rawBet.selection, rawBet.selectionName, rawBet.runnerName, rawBet.status) || '-';
    const description =
      firstText(rawBet.narration, rawBet.description) ||
      [sport.label, eventName, marketName, 'Result', selection].filter(Boolean).join(' > ');

    return [
      {
        id: firstText(rawBet.id, rawBet.txnId) || `${sport.id}-${eventId}-${index}`,
        sportId: sport.id,
        sportLabel: sport.label,
        apiSport: sport.apiSport,
        eventId,
        eventName,
        eventDate,
        settledAt,
        marketName,
        marketType: getMarketType(rawBet),
        selection,
        description,
        profitLoss: getProfitLoss(rawBet),
        balance: asFiniteNumber(rawBet.availableBalance ?? rawBet.balance),
        remark: firstText(rawBet.remark) || undefined,
      },
    ];
  });

export const filterProfitLossBets = (
  bets: ProfitLossBet[],
  filters: {
    fromDate?: string;
    toDate?: string;
    search?: string;
    marketType?: ProfitLossMarketType;
  }
): ProfitLossBet[] => {
  const fromDate = filters.fromDate ? dayjs(filters.fromDate).startOf('day') : null;
  const toDate = filters.toDate ? dayjs(filters.toDate).endOf('day') : null;
  const searchTerm = filters.search?.trim().toLowerCase() ?? '';

  return bets.filter((bet) => {
    const reportDate = dayjs(bet.settledAt || bet.eventDate);
    if (fromDate?.isValid() && reportDate.isValid() && reportDate.isBefore(fromDate)) return false;
    if (toDate?.isValid() && reportDate.isValid() && reportDate.isAfter(toDate)) return false;
    if (filters.marketType && bet.marketType !== filters.marketType) return false;
    if (!searchTerm) return true;

    return [bet.sportLabel, bet.eventName, bet.marketName, bet.selection, bet.description].some(
      (value) => value.toLowerCase().includes(searchTerm)
    );
  });
};

export const groupProfitLossBySport = (bets: ProfitLossBet[]): ProfitLossSportGroup[] => {
  const groups = new Map<string, ProfitLossSportGroup>();

  bets.forEach((bet) => {
    const existingGroup = groups.get(bet.sportId);
    if (existingGroup) {
      existingGroup.bets.push(bet);
      existingGroup.profitLoss += bet.profitLoss;
      return;
    }

    groups.set(bet.sportId, {
      id: bet.sportId,
      label: bet.sportLabel,
      apiSport: bet.apiSport,
      profitLoss: bet.profitLoss,
      bets: [bet],
    });
  });

  return Array.from(groups.values());
};

export const groupProfitLossByEvent = (bets: ProfitLossBet[]): ProfitLossEventGroup[] => {
  const groups = new Map<string, ProfitLossEventGroup>();

  bets.forEach((bet) => {
    const groupId = `${bet.sportId}:${bet.eventId}`;
    const existingGroup = groups.get(groupId);
    if (existingGroup) {
      existingGroup.bets.push(bet);
      existingGroup.profitLoss += bet.profitLoss;
      return;
    }

    groups.set(groupId, {
      id: groupId,
      sportId: bet.sportId,
      sportLabel: bet.sportLabel,
      apiSport: bet.apiSport,
      name: bet.eventName,
      date: bet.settledAt || bet.eventDate,
      profitLoss: bet.profitLoss,
      bets: [bet],
    });
  });

  return Array.from(groups.values()).sort((firstGroup, secondGroup) => {
    const firstDate = dayjs(firstGroup.date);
    const secondDate = dayjs(secondGroup.date);
    if (!firstDate.isValid() || !secondDate.isValid()) return 0;
    return secondDate.valueOf() - firstDate.valueOf();
  });
};

export const transactionsToLedgerRows = (
  transactions: readonly Transaction[]
): ProfitLossLedgerRow[] =>
  transactions.map((transaction, index) => {
    const amount = Math.abs(asFiniteNumber(transaction.amount) ?? 0);
    const transactionType = transaction.type?.toLowerCase();
    const profitLoss =
      transactionType === 'debit'
        ? -amount
        : transactionType === 'credit'
          ? amount
          : (asFiniteNumber(transaction.amount) ?? 0);

    return {
      id: transaction.id || `transaction-${index}`,
      timestamp: transaction.timestamp ?? '',
      description: firstText(transaction.narration, transaction.context) || '-',
      profitLoss,
      balance: asFiniteNumber(transaction.availableBalance),
      remark: firstText(transaction.remark) || undefined,
    };
  });

const parseTransactionMeta = (meta: unknown): UnknownRecord => {
  if (isRecord(meta)) return meta;
  if (typeof meta !== 'string') return {};

  try {
    const parsedMeta = JSON.parse(meta);
    return isRecord(parsedMeta) ? parsedMeta : {};
  } catch {
    return {};
  }
};

const normalizeComparableText = (value: unknown): string =>
  asText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

const marketTypeCodesByReportType: Record<ProfitLossMarketType, string[]> = {
  'Main Market': ['normal', 'mainmarket', 'main', 'exchange'],
  'Fancy Market': ['fancy', 'session'],
  'Bookmaker Market': ['bookmaker', 'bookmakermarket'],
};

const transactionMatchesMarketType = (
  meta: UnknownRecord,
  marketType: ProfitLossMarketType,
  expectedMarketTypeCodes: readonly string[]
): boolean => {
  const metaMarketType = normalizeComparableText(meta.marketType);
  const metaMarketName = normalizeComparableText(meta.marketName);

  if (marketType === 'Bookmaker Market' && metaMarketName.includes('bookmaker')) return true;
  if (marketType === 'Fancy Market' && metaMarketName.includes('fancy')) return true;

  return !metaMarketType || expectedMarketTypeCodes.includes(metaMarketType);
};

export const filterTransactionsForProfitLossEvent = (
  transactions: readonly Transaction[],
  event: ProfitLossEventGroup,
  marketType: ProfitLossMarketType
): Transaction[] => {
  const eventIdParts = event.id.split(':');
  const eventId = eventIdParts[eventIdParts.length - 1];
  const expectedEventId = normalizeComparableText(eventId);
  const expectedSport = normalizeComparableText(event.apiSport || event.sportLabel);
  const expectedMarketTypeCodes = marketTypeCodesByReportType[marketType];
  const expectedMarketNames = new Set(
    event.bets
      .map((bet) => normalizeComparableText(bet.marketName))
      .filter((marketName) => marketName && marketName !== '-')
  );

  return transactions.filter((transaction) => {
    const meta = parseTransactionMeta(transaction.meta);
    const metaEventId = normalizeComparableText(meta.eventId);
    if (expectedEventId && metaEventId && metaEventId !== expectedEventId) return false;

    const metaSport = normalizeComparableText(meta.sport);
    if (expectedSport && metaSport && metaSport !== expectedSport) return false;

    if (!transactionMatchesMarketType(meta, marketType, expectedMarketTypeCodes)) {
      return false;
    }

    const metaMarketName = normalizeComparableText(meta.marketName);
    if (expectedMarketNames.size > 0 && metaMarketName && !expectedMarketNames.has(metaMarketName)) {
      return false;
    }

    return true;
  });
};

export const betsToLedgerRows = (bets: ProfitLossBet[]): ProfitLossLedgerRow[] =>
  bets.map((bet) => ({
    id: bet.id,
    timestamp: bet.settledAt || bet.eventDate,
    description: bet.description,
    profitLoss: bet.profitLoss,
    balance: bet.balance,
    remark: bet.remark,
  }));

const absoluteNumberFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const totalNumberFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatProfitLoss = (value: number): string =>
  absoluteNumberFormatter.format(Math.abs(value));

export const formatTotalProfitLoss = (value: number): string => totalNumberFormatter.format(value);

export const formatBalance = (value?: number): string =>
  value === undefined ? '-' : totalNumberFormatter.format(value);

export const formatReportDate = (value: string): string => {
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : value || '-';
};

export const formatReportTimestamp = (value: string): string => {
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY HH:mm') : value || '-';
};

const escapeCsvCell = (value: unknown): string => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const downloadCsv = (filename: string, rows: unknown[][]): void => {
  const csv = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const toFilenamePart = (value: string): string => slugify(value);
