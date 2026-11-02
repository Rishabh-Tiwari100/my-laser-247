import apiSlice from './apiSlice';

export interface ProfitLossItem {
  id?: string;
  eventId?: string;
  marketId?: string;
  marketName?: string;
  marketType?: string;
  marketCategory?: string | null;
  selectionId?: string;
  selectionName?: string;
  runnerName?: string;
  rate?: string;
  stake?: string;
  pl?: string; // Profit/Loss
  betOn?: 'BACK' | 'LAY';
  createdAt?: string;
  eventName?: string;
  matchId?: string;
  amount?: string | number;
  odds?: string | number;
  selection?: string;
  sport?: string;
  percentage?: string | null;
  status?: string;
  payout?: string | number;
  liability?: string | number;
  potentialProfit?: string | number;
  placedAt?: string;
  settledAt?: string;
  isBookmaker?: boolean;
  event?:
  | string
  | {
    id?: string;
    name?: string;
    startTime?: string;
    startsAt?: string;
    openDate?: string;
    time?: string;
  };
  [key: string]: any;
}

export interface ProfitLossResponse {
  success?: boolean;
  message?: string;
  bets?: ProfitLossItem[];
  pagination?: Pagination;
}

export interface Pagination {
  totalItems: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

export interface CasinoProfitLossItem {
  id: number;
  gameId: number;
  gameName: string;
  roundId: string;
  txnId: string;
  userId: string;
  status: 'Won' | 'Lost' | 'Pending';
  totalBets: string;
  totalWins: string;
  totalLosses: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BetProfitLossResponse {
  success?: boolean;
  message?: string;
  bets?: ProfitLossItem[] | CasinoProfitLossItem[];
  pagination?: Pagination;
  filteredProfitLoss?: string | number;
  totalProfitLossAllSports?: string | number;
}

export interface ProfitLossQueryParams {
  page?: number;
  limit?: number;
  sport: string;
  eventId?: string | number;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface BetHistoryParams {
  page?: number;
  limit?: number;
  betTime: string;
  fromDate?: string;
  toDate?: string;
  eventId?: string | number;
  marketType?: string;
  status?: string;
  sport?: string;
  search?: string;
}

export interface BetEventsResponse {
  success: boolean;
  message: string;
  bets: BetEvent[];
  pagination: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPage: number;
  };
}

export interface BetEvent {
  eventId: string;
  eventName: string;
  lastBetPlacedAt: string;
  count: number
}


export interface BetEventsQueryParams {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  betTime: string;
  status?: string;
  eventId?: string | number;
  marketId?: string;
  sport?: string;
  marketType?: string;
  search?: string;
  timezone?: string;
  fileName?: string;
  exportFormat?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SportProfitLossResponse {
  success: boolean;
  message: string;
  data: {
    sport: string;
    profitLoss: number;
  }[];
}

export interface EventProfitLossResponse {
  success: boolean;
  message: string;
  data: {
    eventId: string;
    eventName: string;
    sport: string;
    profitLoss: number;
    placeAt: string;
  }[];
  pagination?: Pagination;
}

export const betApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBetHistory: builder.query<ProfitLossResponse, BetHistoryParams>({
      query: (params) => ({
        url: '/bet/history',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
      providesTags: ['Bets'],
    }),

    getProfitLoss: builder.query<BetProfitLossResponse, ProfitLossQueryParams>({
      query: (params) => ({
        url: '/bet/profit-loss',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
    }),
    getbetEvents: builder.query<BetEventsResponse, BetEventsQueryParams>({
      query: (params) => ({
        url: '/bet/history/event',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
    }),
    getProfitLossBySports: builder.query<SportProfitLossResponse, { fromDate?: string; toDate?: string, search?: string }>({
      query: (params) => ({
        url: '/bet/profit-loss/sports',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
    }),
    getProfitLossByEvent: builder.query<EventProfitLossResponse, { page?: number; limit?: number; fromDate?: string; toDate?: string; sport?: string, subType?: string }>({
      query: (params) => ({
        url: '/bet/profit-loss/events',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
    }),
  }),
});

export const {
  useGetBetHistoryQuery,
  useLazyGetBetHistoryQuery,
  useGetProfitLossQuery,
  useGetbetEventsQuery,
  useLazyGetbetEventsQuery,
  useGetProfitLossBySportsQuery,
  useGetProfitLossByEventQuery,
} = betApi;
