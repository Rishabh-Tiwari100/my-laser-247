import apiSlice from './apiSlice';
import {
  UserBonusSummary,
  ReferredUsersResponse,
  ReferredUsersQuery,
  ReferralTotals,
} from '@/types/referral';

export const userBonusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserBonusSummary: builder.query<UserBonusSummary, void>({
      query: () => ({
        url: '/user-bonus/referral/earnings',
        method: 'GET',
      }),
    }),

    getReferralUsers: builder.query<ReferredUsersResponse, ReferredUsersQuery>({
      query: ({ page = 1, limit = 10, status, fromDate, toDate }) => ({
        url: '/user-bonus/referral/referees',
        method: 'GET',
        params: {
          page: page,
          limit: limit,
          status,
          from: fromDate,
          to: toDate,
        },
      }),
    }),

    getReferralTotals: builder.query<ReferralTotals, void>({
      query: () => ({
        url: '/user-bonus/referral/totals',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserBonusSummaryQuery, useGetReferralUsersQuery, useGetReferralTotalsQuery } =
  userBonusApi;
