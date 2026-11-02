import { apiSlice } from './apiSlice';

export interface Transaction {
  id: string;
  walletId: string | number;
  amount: number | string;
  availableBalance?: number | string;
  type?: string;
  entityId?: string | null;
  context?: string | null;
  meta?: any;
  nonce?: number;
  status?: string | null;
  remark?: string | null;
  timestamp?: string | null;
  image?: string | null;
  transactionCode?: string | null;
  transactionHash?: string | null;
  digitalPaymentId?: string | null;
  isCommissionSettled?: boolean;
  currencyId?: number | string;
  narration?: string | null;
}

export interface Pagination {
  currentPage: number;
  totalPage: number;
  totalItems: number;
  limit: number;
}

export interface TransactionsResponse {
  data: Transaction[];
  pagination: Pagination;
}

export interface TransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  eventId?: string | number;
  fromDate?: string;
  toDate?: string;
  context?: string;
  contextType?: string;
  recordType?: string;
  type?: string;
  walletType?: string;
}

export const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMyTransactions: build.query<TransactionsResponse, TransactionsParams | void>({
      query: (params) => {
        const p = params || {};
        const queryParams: Record<string, string | number> = {};

        if (p.page !== undefined) queryParams.page = p.page;
        if (p.limit !== undefined) queryParams.limit = p.limit;
        if (p.search) queryParams.search = p.search;
        if (p.eventId !== undefined) queryParams.eventId = p.eventId;
        if (p.fromDate) queryParams.fromDate = p.fromDate;
        if (p.toDate) queryParams.toDate = p.toDate;
        if (p.context) queryParams.context = p.context;
        if (p.contextType) queryParams.contextType = p.contextType;
        if (p.type) queryParams.type = p.type;
        if (p.walletType) queryParams.walletType = p.walletType;
        if (p.recordType) queryParams.recordType = p.recordType;

        return {
          url: '/users/me/transactions',
          method: 'GET',
          params: { t: Date.now(), ...queryParams },
        };
      },
    }),
  }),
});

export const { useGetMyTransactionsQuery, useLazyGetMyTransactionsQuery } = transactionsApi;
