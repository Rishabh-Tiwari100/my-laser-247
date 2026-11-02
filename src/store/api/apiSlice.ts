import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import Cookies from 'js-cookie';
import { logout } from '@/store/slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  prepareHeaders: (headers, { getState, endpoint }) => {

    const token = (getState() as RootState).auth.accessToken;
    const tempAuthToken = (getState() as RootState).auth.tempAuthToken;
    const finalToken = token || tempAuthToken;
    if (finalToken) {
      headers.set('authorization', `Bearer ${finalToken}`);
    }
    // headers.set('content-type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  const state = api.getState() as RootState;
  const hadAuthToken = Boolean(state.auth.accessToken || state.auth.tempAuthToken);

  if (result.error && result.error.status === 401 && hadAuthToken) {
    console.warn('Unauthorized! Logging out user...');
    Cookies.remove('authToken');
    api.dispatch(logout());
    setTimeout(() => {
      if (window.location.pathname === '/login') return;
      window.location.href = '/login';
    }, 2000);
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  // baseQuery: baseQuery,
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0,
  tagTypes: [
    'UserDetails',
    'Auth',
    'FeatureFlags',
    'Competitions',
    'Events',
    'SystemSettings',
    'Affiliates',
    'Bookset',
    'Sports',
    'OneClickBetting',
    'Account',
    'User',
    'Bets',
    'Casino',
  ],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {
  util: { getRunningQueriesThunk },
} = apiSlice;

export default apiSlice;
