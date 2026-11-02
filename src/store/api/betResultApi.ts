import {
  BetResultResponse,
  BetResultScoreQueryParams,
  BetResultScoreResponse,
  EventResultQueryParams,
  EventResultResponse,
} from '@/types/betResult';
import apiSlice from './apiSlice';

export const betResultApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEventResults: builder.query<EventResultResponse, EventResultQueryParams>({
      query: (params) => ({
        url: '/bet-result/fancy/event',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
    }),

    getResultByEventId: builder.query<
      BetResultResponse,
      EventResultQueryParams & { eventId: string }
    >({
      query: ({ eventId, ...params }) => ({
        url: `/bet-result/fancy/event/${eventId}`,
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
    }),

    getBetResultScore: builder.query<BetResultScoreResponse, BetResultScoreQueryParams>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {
          t: Date.now(),
        };

        if (params?.sport) queryParams.sport = params.sport;
        if (params?.day) queryParams.day = params.day;
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;

        return {
          url: '/bet-result/score',
          method: 'GET',
          params: queryParams,
        };
      },
    }),
  }),
});

export const {
  useGetEventResultsQuery,
  useGetBetResultScoreQuery,
  useLazyGetResultByEventIdQuery,
} = betResultApi;
