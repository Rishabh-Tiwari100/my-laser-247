import apiSlice from './apiSlice';

export interface StakeItem {
  label: string;
  value: number;
}

export interface GetStakeSetResponse {
  success: boolean;
  message: string;
  stakeSet: StakeItem[];
}

export interface UpdateStakeSetPayload {
  data: StakeItem[];
  type:string
}

export interface UpdateStakeSetResponse {
  success: boolean;
  message: string;
}

export const stakeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStakeSet: builder.query<GetStakeSetResponse, {type:string}>({
      query: ({type}) => ({
        url: `/stakeset?type=${type}`,
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),

    updateStakeSet: builder.mutation<UpdateStakeSetResponse, UpdateStakeSetPayload>({
      query: (body) => ({
        url: '/stakeset',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useGetStakeSetQuery, useUpdateStakeSetMutation } = stakeApi;
