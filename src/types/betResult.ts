export type ResultDayTab = 'Today' | 'Yesterday';

export type ResultTypeTab = 'FancyBet' | 'Normal';

export interface BetResultScoreQueryParams {
  sport?: string;
  day?: string;
  page?: number;
  limit?: number;
}

export interface BetResultScoreItem {
  eventName: string;
  eventDate: string;
  home: string;
  away: string;
}

export interface BetResultScoreResponse {
  success: boolean;
  message: string;
  results: BetResultScoreItem[];
  pagination?: Pagination;
}

export interface Pagination {
  totalItems: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

export interface EventResultItem {
  id: string;
  externalId: string;
  name: string;
  startTime?: string;
}

export interface EventResultResponse {
  success?: boolean;
  message?: string;
  events?: EventResultItem[];
  pagination?: Pagination;
}

export interface EventResultQueryParams {
  page?: number;
  limit?: number;
  day?: string;
}

export interface BetResultItem {
  id?: string;
  eventId?: string;
  marketId?: string;
  marketName?: string;
  resultStatus?: string;
  winnerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BetResultResponse {
  success?: boolean;
  message?: string;
  results?: BetResultItem[];
  pagination?: Pagination;
}
