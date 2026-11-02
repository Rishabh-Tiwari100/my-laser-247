import { createSlice } from '@reduxjs/toolkit';
import { notificationApi } from '../api/notificationApi';
import { NotificationGroup } from '@/types/notification';

interface NotificationState {
  notifications: NotificationGroup;
}

const initialState: NotificationState = {
  notifications: {},
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = {};
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      notificationApi.endpoints.getNotifications.matchFulfilled,
      (state, { payload }) => {
        state.notifications = payload.data || {};
      }
    );
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
