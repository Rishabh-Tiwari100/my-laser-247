import apiSlice from './apiSlice';
import {
  AffiliateCommissionPayload,
  AffiliateDashboardResponse,
  AffiliateReferralResponse,
  CreateAffiliatePayload,
  CreateAffiliateResponse,
  WeeklyCommissionQueryParams,
  WeeklyCommissionResponse,
} from '@/types/affiliate';

export const affiliateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAffiliate: builder.mutation<CreateAffiliateResponse, CreateAffiliatePayload>({
      query: (data) => ({
        url: '/affiliate/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Affiliates'],
    }),

    getAffiliateDashboard: builder.query<AffiliateDashboardResponse, void>({
      query: () => {
        return {
          url: '/affiliate/affiliate-dashboard',
          method: 'GET',
          params: { t: Date.now() },
        };
      },
      providesTags: ['Affiliates'],
    }),

    getReferredUsers: builder.query<AffiliateReferralResponse, AffiliateCommissionPayload>({
      query: (params) => {
        const queryParams: any = {};

        if (params.page) queryParams.page = params.page;
        if (params.limit) queryParams.limit = params.limit;
        if (params.search) queryParams.search = params.search;
        if (params.fromDate) queryParams.fromDate = params.fromDate;
        if (params.toDate) queryParams.toDate = params.toDate;
        if (params.status && params.status !== 'all') queryParams.status = params.status;

        return {
          url: '/affiliate/referred-users',
          method: 'GET',
          params: { ...queryParams, t: Date.now() },
        };
      },
    }),

    getWeeklyCommission: builder.query<WeeklyCommissionResponse, WeeklyCommissionQueryParams>({
      query: ({ page = 1, limit = 10, status, fromDate, toDate }) => {
        const params = new URLSearchParams();

        params.set('page', String(page));
        params.set('limit', String(limit));

        if (status && status !== 'ALL') {
          params.set('status', status);
        }

        if (fromDate) params.set('fromDate', fromDate);
        if (toDate) params.set('toDate', toDate);

        params.set('t', String(Date.now()));

        return {
          url: '/affiliate/weekly-commission',
          method: 'GET',
          params, // ✅ PASS DIRECTLY
        };
      },
    }),
  }),
});

export const {
  useCreateAffiliateMutation,
  useGetAffiliateDashboardQuery,
  useGetReferredUsersQuery,
  useGetWeeklyCommissionQuery,
} = affiliateApi;
