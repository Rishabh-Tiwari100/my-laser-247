import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  accessToken: string | null;
  tempAuthToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 👇 Get initial token from cookies
const getInitialToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('authToken') || null;
};

const initialState: AuthState = {
  accessToken: getInitialToken(),
  tempAuthToken: null,
  isAuthenticated: Boolean(getInitialToken()),
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Set token after successful login
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.accessToken = token;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;

      // Save in cookie (1 day expiry)
      Cookies.set('authToken', token, {
        expires: 1, // 1 day
        secure: true,
        sameSite: 'strict',
      });
    },

    setTempAuthToken: (state, action: PayloadAction<string | null>) => {
      state.tempAuthToken = action.payload;
    },

    // Remove token on logout
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Remove from cookie
      Cookies.remove('authToken');
    },
  },
});

export const { setLoading, setError, setToken, setTempAuthToken, logout } = authSlice.actions;
export default authSlice.reducer;
