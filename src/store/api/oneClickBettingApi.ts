import apiSlice from './apiSlice';

export interface OneClickBettingConfig {
  id?: string;
  userId?: string;
  firstField: string;
  secondField: string;
  thirdField: string;
}

export interface SaveOneClickBettingPayload {
  oneClickId: string | number;
  firstField: string | number;
  secondField: string | number;
  thirdField: string | number;
}

export interface GetOneClickBettingResponse extends Partial<OneClickBettingConfig> {
  success?: boolean;
  message?: string;
  data?: OneClickBettingConfig;
}

export interface SaveOneClickBettingResponse extends Partial<OneClickBettingConfig> {
  success?: boolean;
  message?: string;
  data?: OneClickBettingConfig;
}

export const oneClickBettingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOneClickBetting: builder.query<GetOneClickBettingResponse, string | number>({
      query: (userId) => ({
        url: `/users/one-click-betting`,
        method: 'GET',
        params: { t: Date.now() },
      }),
      providesTags: ['OneClickBetting'],
    }),

    saveOneClickBetting: builder.mutation<SaveOneClickBettingResponse, SaveOneClickBettingPayload>({
      query: (body) => ({
        url: '/users/one-click-betting',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OneClickBetting'],
    }),
  }),
});

export const { useGetOneClickBettingQuery, useSaveOneClickBettingMutation } = oneClickBettingApi;
