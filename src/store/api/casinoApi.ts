import {
  CasinoProvider,
  CasinoProviderResponse,
  CasinoRoundHistoryPayload,
  CasinoRoundHistoryResponse,
  CreateCasinoSessionRequest,
  CreateCasinoSessionResponse,
  GetCasinoGamesParams,
  GetCasinoGamesResponse,
} from '@/types/casino';
import { apiSlice } from './apiSlice';

export const casinoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCasinoGames: builder.query<GetCasinoGamesResponse, GetCasinoGamesParams>({
      query: ({ search, provider, category, page, limit, userId, status } = {}) => {
        const params = new URLSearchParams();

        if (search) params.append('search', search);
        if (provider) params.append('provider', provider);
        if (category) params.append('category', category);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (userId) params.append('userId', userId.toString());
        if (status) params.append('status', status);

        return {
          url: `/casino/games${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
          params: { t: Date.now() },
        };
      },
      providesTags: ['Casino'],
    }),

    getCasinoCategories: builder.query<{ games: string[] }, { search?: string; provider?: string }>(
      {
        query: ({ search, provider } = {}) => {
          const params = new URLSearchParams();
          if (search) params.append('search', search);
          if (provider) params.append('provider', provider);

          return {
            url: `/casino/category${params.toString() ? `?${params.toString()}` : ''}`,
            method: 'GET',
            params: { t: Date.now() },
          };
        },
        // providesTags: ['CasinoCategories'],
      }
    ),

    getCasinoProviders: builder.query<
      {
        success: boolean;
        message: string;
        providers: CasinoProvider[];
      },
      void
    >({
      query: () => {
        return {
          url: `/casino/providers`,
          method: 'GET',
          params: { t: Date.now() },
        };
      },
    }),

    getCasinoRoundHistory: builder.query<CasinoRoundHistoryResponse, CasinoRoundHistoryPayload>({
      query: ({ search, provider, status, fromDate, toDate, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();

        if (search) params.append('search', search);
        if (provider) params.append('provider', provider);
        if (status) params.append('status', status);
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        return {
          url: `/casino/round/history?${params.toString()}`,
          method: 'GET',
          params: { t: Date.now() },
        };
      },
      // providesTags: ['CasinoRoundHistory'],
    }),

    getCasinoRoundHistoryById: builder.query<CasinoRoundHistoryResponse, number | string>({
      query: (id) => ({
        url: `/casino/round/history/${id}`,
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),

    createCasinoSession: builder.mutation<CreateCasinoSessionResponse, CreateCasinoSessionRequest>({
      query: ({ id, platform }) => ({
        url: `/casino/create-session/${id}`,
        method: 'POST',
        body: { platform },
      }),
      //   invalidatesTags: ['CasinoSession'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCasinoGamesQuery,
  useLazyGetCasinoGamesQuery,
  useGetCasinoCategoriesQuery,
  useGetCasinoProvidersQuery,
  useGetCasinoRoundHistoryQuery,
  useGetCasinoRoundHistoryByIdQuery,
  useCreateCasinoSessionMutation,
} = casinoApi;
