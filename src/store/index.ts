import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authSlice } from './slices/authSlice';
import { apiSlice } from './api/apiSlice';
import userReducer from './slices/userSlice';
import walletReducer from './slices/walletSlice';
import notificationReducer from './slices/notificationSlice';
import bannerReducer from './slices/bannerSlice';
import betReducer from './slices/betSlice';
import casinoReducer from './slices/casinoGameDetailSlice';
import triggerReducer from './slices/triggerSlice';
import contactSupportReducer from './slices/contactSupportSlice';
import systemSettingsReducer from './slices/systemSettingsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    api: apiSlice.reducer,
    user: userReducer,
    wallet: walletReducer,
    notification: notificationReducer,
    banner: bannerReducer,
    betPlace: betReducer,
    casino: casinoReducer,
    trigger: triggerReducer,
    contactSupport: contactSupportReducer,
    systemSettings: systemSettingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export action creators
export const { setToken, logout } = authSlice.actions;
