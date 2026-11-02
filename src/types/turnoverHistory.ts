export interface TurnoverItem {
  id: string;
  userId: string;
  sourceType: 'Sports' | 'Casino' | string;

  betId: string | null;
  casinoTransactionHisotryId: number | null;

  amount: string;
  turnoverMain: string;
  turnoverBonus: string;

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  bet: {
    id: string;
    userId: string;
    eventId: string;
    sport: string;
    marketId: string;
    marketName: string;
    marketCategory: string | null;
    marketType: string;
    amount: string;
    bonusUsages: string;
    odds: string;
    percentage: string | null;
    betOn: string;
    selection: string;
    selectionId: string;
    payout: string;
    status: string;
    isBookmaker: boolean;
    placedAt: string;
    settledAt: string;
    ip: string;
    isTurnOverCalculated: boolean;
    isLossBackCalc: boolean;
    isReferralLossCommissionCalc: boolean;
    event: {
      id: string;
      name: string;
    };
  } | null;

  casinoTransaction: {
    id: number;
    gameName: string;
    amount: string;
    payout: string;
  } | null;
}

export interface Pagination {
  totalItems: number;
  limit: number;
  currentPage: number;
  totalPage: number;
}

export interface GetTurnoverParams {
  page?: number;
  limit?: number;
  fromDate?: string; // ISO string
  toDate?: string; // ISO string
  sourceType?: 'Sports' | 'Casino';
}

export interface TurnoverHistoryResponse {
  data: TurnoverItem[];
  pagination: Pagination;
}
