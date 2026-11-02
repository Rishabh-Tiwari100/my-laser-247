import { BetOn, BetPlaceRequest, MarketType } from '@/types/betPlace';

export interface BetPnL {
  profit: number;
  loss: number;
  betOn: BetOn;
  selectionId: string | number;
  eventId: string | number;
  marketId: string | number;
}

export function intoDecimal(odds: string | number | null | undefined): number {
  if (!odds) return 0;
  const num = Number(odds);
  if (Number.isNaN(num)) return 0;

  if (num % 1 !== 0) return num;
  if (num > 0) return parseFloat((num / 100 + 1).toFixed(2));

  return num;
}

export const calculateProfitLoss = (
  marketCategory: MarketType,
  bet: BetPlaceRequest,
  currentEventId?: number | string,
  currentSelectionId?: number | string,
  currentMarketId?: number | string,
  gameType?: string
): number | null => {
  if (bet?.eventId != currentEventId || bet?.marketId != currentMarketId) return null;

  const stake = Number(bet.stake);
  const rate =
    marketCategory === 'FANCY' && gameType?.toLowerCase() === 'session'
      ? intoDecimal(bet.fancyPercentage)
      : Number(bet.rate);
  const isSameRunner = bet?.selectionId == currentSelectionId;

  let profit;
  const loss = stake;
  let exposure = 0;
  const marketName = (bet?.marketName ?? '').toLowerCase();
  const isTossMarket = marketName.includes('toss');
  const isFancyOne = gameType?.toLowerCase() === 'fancy1';

  if (
    (marketCategory === 'NORMAL' &&
      (marketName.includes('bookmaker') || isTossMarket)) ||
    (marketCategory === 'FANCY' && isFancyOne)
  ) {
    profit = (rate / 100) * stake;
  } else {
    profit = Number(((rate - 1) * stake).toFixed(2));
  }

  if (bet.betOn === 'BACK') {
    exposure += isSameRunner ? profit : -loss;
  } else if (bet.betOn === 'LAY') {
    exposure += isSameRunner ? -profit : loss;
  }

  return exposure;
};
