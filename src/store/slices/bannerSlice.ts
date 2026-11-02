import { createSlice } from '@reduxjs/toolkit';
import { bannerApi } from '../api/bannerApi';
import { BannerGroup } from '@/types/banner';

interface BannerState {
  banners: BannerGroup;
  count: number;
}

const initialState: BannerState = {
  banners: {},
  count: 0,
};

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    clearBanners(state) {
      state.banners = {};
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(bannerApi.endpoints.getBanners.matchFulfilled, (state, { payload }) => {
      state.banners = payload.data || {};
      state.count = payload.count || 0;
    });
  },
});

export const { clearBanners } = bannerSlice.actions;
export default bannerSlice.reducer;
