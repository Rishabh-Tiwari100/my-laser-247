import { apiSlice } from './apiSlice';
import { NotificationResponse } from '@/types/notification';

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationResponse, { type?: string } | void>({
      query: (params = {}) => {
        return {
          url: `/notifications`,
          method: 'GET',
          params: { t: Date.now() },
        };
      },
      // providesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
