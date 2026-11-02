export type BetOn = 'BACK' | 'LAY';
export type MarketType = 'NORMAL' | 'FANCY' | 'PREMIUM';

export interface BetPlaceRequest {
  position: number;
  eventId: number;
  marketId: string;
  eventName?: string;
  marketName: string;
  marketType: MarketType;
  marketCategory: string;
  selectionId: string;
  runnerName: string;
  stake: number;
  rate: number;
  fancyPercentage: number;
  betOn: BetOn;
  acceptOddsChange?: boolean; // optional
  min?: string | number;
  max?: string | number;
}
