import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CasinoGameDetailState {
  selectedGame: any | null;
  isUrlFetched: boolean;
}

const initialState: CasinoGameDetailState = {
  selectedGame: null,
  isUrlFetched: false,
};

const casinoGameDetailSlice = createSlice({
  name: 'casinoGameDetail',
  initialState,
  reducers: {
    setCasinoGameDetail(state, action: PayloadAction<any>) {
      state.selectedGame = action.payload;
    },
    clearCasinoGameDetail(state) {
      state.selectedGame = null;
      state.isUrlFetched = false;
    },
    setIsUrlFetched(state, action: PayloadAction<boolean>) {
      state.isUrlFetched = action.payload;
    },
    clearIsUrlFetched(state) {
      state.isUrlFetched = false;
    },
  },
});

export const { setCasinoGameDetail, clearCasinoGameDetail, setIsUrlFetched, clearIsUrlFetched } =
  casinoGameDetailSlice.actions;
export default casinoGameDetailSlice.reducer;
