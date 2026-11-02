import { BetPlaceRequest } from '@/types/betPlace';
import apiSlice from '../api/apiSlice';

export interface BetPlaceResponse {
  message: string;
  data?: any;
}

export const betApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeBet: builder.mutation<BetPlaceResponse, BetPlaceRequest>({
      query: (body) => ({
        url: '/bet/place',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Bookset','Bets'],
    }),
  }),
});

export const { usePlaceBetMutation } = betApi;
