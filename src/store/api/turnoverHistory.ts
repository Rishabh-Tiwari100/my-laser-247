import { GetTurnoverParams, TurnoverHistoryResponse } from '@/types/turnoverHistory';
import apiSlice from './apiSlice';

export const turnoverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTurnover: builder.query<TurnoverHistoryResponse, GetTurnoverParams>({
      query: ({ page, limit, fromDate, toDate, sourceType }) => ({
        url: '/turnover',
        method: 'GET',
        params: {
          page,
          limit,
          fromDate,
          toDate,
          sourceType,
        },
      }),
      // providesTags: ['Turnover'],
    }),
  }),
});

export const { useGetTurnoverQuery } = turnoverApi;
