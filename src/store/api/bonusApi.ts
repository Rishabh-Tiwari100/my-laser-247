import apiSlice from './apiSlice';
import {
  BonusTotalSummaryResponse,
  BonusTurnoverItem,
  BonusTurnoverQuery,
  BonusStatementItem,
  BonusStatementQuery,
  BonusEarningsResponse,
  BonusApplicantsQuery,
  BonusApplicantsResponse,
  PaginatedResponse,
} from '@/types/bonus';

export const bonusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBonusTotalSummary: builder.query<BonusTotalSummaryResponse, void>({
      query: () => ({
        url: '/user-bonus/total-summary',
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),

    getBonusTurnover: builder.query<PaginatedResponse<BonusTurnoverItem>, BonusTurnoverQuery>({
      query: ({ status, page = 0, limit = 10 }) => ({
        url: '/user-bonus/turnover',
        params: { status, skip: page, take: limit, t: Date.now() },
      }),
    }),

    getBonusStatement: builder.query<PaginatedResponse<BonusStatementItem>, BonusStatementQuery>({
      query: ({ fromDate, toDate, page = 1, limit = 10 }) => ({
        url: '/user-bonus/statement',
        params: { fromDate: fromDate, toDate: toDate, skip: page, take: limit, t: Date.now() },
      }),
    }),

    getBonusEarnings: builder.query<BonusEarningsResponse, void>({
      query: () => ({
        url: '/user-bonus/earnings',
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),

    getBonusApplicantsList: builder.query<BonusApplicantsResponse, BonusApplicantsQuery>({
      query: ({
        page = 1,
        limit = 10,
        platformId = 1,
        fromDate,
        toDate,
        username,
        status,
        category,
        releaseType,
        approvalType,
        userId,
        search,
        timezone,
        fileName,
        exportFormat,
        isExport = true,
      }) => ({
        url: '/bonuses/applicants/list',
        method: 'GET',
        params: {
          page,
          limit,
          platformId,
          fromDate,
          toDate,
          username,
          status,
          category,
          releaseType,
          approvalType,
          userId,
          search,
          timezone,
          fileName,
          exportFormat,
          isExport,
          t: Date.now(),
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBonusTotalSummaryQuery,
  useGetBonusTurnoverQuery,
  useGetBonusStatementQuery,
  useGetBonusEarningsQuery,
  useGetBonusApplicantsListQuery,
} = bonusApi;
