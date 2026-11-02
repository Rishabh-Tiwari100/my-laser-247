import { createSlice } from '@reduxjs/toolkit';
import { systemSettingsApi } from '@/store/api/systemSettingApi';
import { SystemSettingsResponse } from '@/types';

interface SystemSettingsState {
  data: SystemSettingsResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SystemSettingsState = {
  data: null,
  isLoading: false,
  error: null,
};

const systemSettingsSlice = createSlice({
  name: 'systemSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(systemSettingsApi.endpoints.getSystemSettings.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addMatcher(
      systemSettingsApi.endpoints.getSystemSettings.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      }
    );

    builder.addMatcher(
      systemSettingsApi.endpoints.getSystemSettings.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to load system settings';
      }
    );
  },
});

export default systemSettingsSlice.reducer;
