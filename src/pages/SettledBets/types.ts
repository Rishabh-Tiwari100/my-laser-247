export type SettledBetSide = 'BACK' | 'LAY';
export type SettledBetStatus = 'Won' | 'Lost' | 'Rollback' | 'Cancelled';

export interface SettledBetRow {
  id: string;
  market: string;
  selection: string;
  odds: string;
  stake: string;
  placedAt: string;
  rate: string;
  profit: string;
  liability: string;
  profitLoss: number;
  status: SettledBetStatus;
  side: SettledBetSide;
  showCashoutBadge: boolean;
}

export interface SettledEventGroup {
  id: string;
  name: string;
  startsAt: string;
  betCount?: number;
  bets: SettledBetRow[];
}

export interface SettledBetFilters {
  fromDate: string;
  toDate: string;
  sport: string;
  subType: string;
  marketType: string;
}
