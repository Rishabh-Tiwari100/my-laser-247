export type ProfitLossMarketType = 'Main Market' | 'Fancy Market' | 'Bookmaker Market';

export interface ProfitLossBet {
  id: string;
  sportId: string;
  sportLabel: string;
  apiSport: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  settledAt: string;
  marketName: string;
  marketType: ProfitLossMarketType;
  selection: string;
  description: string;
  profitLoss: number;
  balance?: number;
  remark?: string;
}

export interface ProfitLossSportGroup {
  id: string;
  label: string;
  apiSport: string;
  profitLoss: number;
  bets: ProfitLossBet[];
}

export interface ProfitLossEventGroup {
  id: string;
  sportId: string;
  sportLabel: string;
  apiSport: string;
  name: string;
  date: string;
  profitLoss: number;
  bets: ProfitLossBet[];
}

export interface ProfitLossFilters {
  fromDate: string;
  toDate: string;
  search: string;
}

export interface ProfitLossDetailFilters {
  fromDate: string;
  toDate: string;
  marketType: ProfitLossMarketType;
}

export interface ProfitLossLedgerRow {
  id: string;
  timestamp: string;
  description: string;
  profitLoss: number;
  balance?: number;
  remark?: string;
}
