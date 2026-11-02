export interface GetCasinoGamesParams {
  search?: string;
  provider?: string;
  category?: string;
  page?: number;
  limit?: number;
  userId?: number | string;
  status?: string;
}

export interface CasinoGame {
  id: number;
  casinoProviderId: number;
  category: string;
  code: string;
  createdAt: string;
  externalId: string;
  gameImage: string;
  gameProviderName: string;
  isTrending: boolean;
  name: string;
  priority: number;
  status: string;
}

export interface GetCasinoGamesResponse {
  success: boolean;
  message: string;
  games: CasinoGame[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface CasinoProvider {
  id?: number | string;
  provider: string;
  name?: string;
  providername?: string;
  aggregator: string;
  status: 'Active' | 'Inactive' | string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CasinoProviderResponse {
  providers: CasinoProvider[];
  success: boolean;
  pagination: Pagination;
}

export interface CasinoRound {
  id: string | number;
  username?: string;
  provider?: string;
  game?: string;
  gameId?: string | number;
  gameName?: string;
  roundId?: string;
  txnId?: string;
  userId?: string | number;
  status: string;
  exchangeRate?: string | number;
  betAmount?: number;
  winAmount?: number;
  totalBets?: string | number;
  totalWins?: string | number;
  totalLosses?: string | number;
  completed?: boolean;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id?: string | number;
    username?: string;
  };
  casinoGame?: {
    id?: string | number;
    name?: string;
  };
}

export interface Pagination {
  totalPage: number;
  currentPage: number;
  limit: number;
  totalItems: number;
}

export interface CasinoRoundHistoryResponse {
  success: boolean;
  rounds: CasinoRound[];
  pagination: Pagination;
}

export interface CasinoRoundHistoryPayload {
  search?: string;
  provider?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateCasinoSessionRequest {
  id: number;
  platform: 'Mobile' | 'Desktop';
}

export interface CreateCasinoSessionResponse {
  success: boolean;
  url?: string; // game launch URL (usually returned by API)
  message?: string; // optional message from API
}
