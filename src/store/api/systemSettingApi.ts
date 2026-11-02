import { SystemSettingsResponse } from '@/types';
import { apiSlice } from './apiSlice';

export const systemSettingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSystemSettings: builder.query<SystemSettingsResponse, void>({
      query: () => ({
        url: '/system',
        method: 'GET',
        params: {
          ts: Date.now(),
        },
      }),
      providesTags: ['SystemSettings'],
    }),
  }),
});

export const { useGetSystemSettingsQuery } = systemSettingsApi;
