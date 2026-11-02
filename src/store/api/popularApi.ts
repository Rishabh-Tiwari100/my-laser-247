import apiSlice from './apiSlice';

export interface PopularEventsResponse {
  success: boolean;
  message: string;
  events: PopularEvent[];
}

export interface PopularEvent {
  id: string;
  name: string;
  sport: string;
  competitionId?: number | string;
  startTime?: string;
}

export const eventsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPopularEvents: builder.query<PopularEventsResponse, void>({
      query: () => ({
        url: '/events/popular',
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),
  }),
});

export const { useGetPopularEventsQuery } = eventsApi;
