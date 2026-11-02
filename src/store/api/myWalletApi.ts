import { MyWalletParams, MyWalletResponse, WalletSummaryResponse } from '@/types/myWallet';
import apiSlice from './apiSlice';

export const walletApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyWalletSummary: builder.query<WalletSummaryResponse, void>({
      query: () => ({
        url: '/my-wallet/summary',
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),

    getMyWallet: builder.query<MyWalletResponse, MyWalletParams | void>({
      query: ({ page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        return {
          url: `/my-wallet?${params.toString()}`,
          method: 'GET',
          params: { t: Date.now() },
        };
      },
    }),
  }),

  overrideExisting: false,
});

export const { useGetMyWalletSummaryQuery, useGetMyWalletQuery } = walletApi;
