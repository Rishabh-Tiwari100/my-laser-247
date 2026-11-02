// src/store/slices/betSlice.ts
import { BetPlaceRequest } from '@/types/betPlace';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BetState {
  betDetails: BetPlaceRequest;
  betPL: number;
  betLimits: BetLimits;
  isBetting: boolean;
  oneClickBetStake: number | null;
  oneClickBetEnabled: boolean;
}

interface BetLimits {
  inPlayMaxBetAmount?: number | string;
  inPlayMinBetAmount?: number | string;
  offPlayMaxBetAmount?: number | string;
  offPlayMinBetAmount?: number | string;
}

const initialState: BetState = {
  betDetails: {} as BetPlaceRequest,
  betPL: 0,
  betLimits: {} as BetLimits,
  isBetting: false,
  oneClickBetStake: null,
  oneClickBetEnabled: false,
};

const betSlice = createSlice({
  name: 'bet',
  initialState,
  reducers: {
    setBetLoading: (state, action: PayloadAction<boolean>) => {
      state.isBetting = action.payload;
    },
    setBetDetails: (state, action: PayloadAction<any>) => {
      state.betDetails = action.payload;
    },
    setBetPL: (state, action: PayloadAction<any>) => {
      state.betPL = action.payload;
    },
    setBetLimits: (state, action: PayloadAction<BetLimits>) => {
      // ⬅ NEW
      state.betLimits = action.payload;
    },
    setOneClickBetStake: (state, action: PayloadAction<number | null>) => {
      state.oneClickBetStake = action.payload;
    },
    setOneClickBetEnabled: (state, action: PayloadAction<boolean>) => {
      state.oneClickBetEnabled = action.payload;
    },
  },
});

export const {
  setBetLoading,
  setBetDetails,
  setBetPL,
  setBetLimits,
  setOneClickBetStake,
  setOneClickBetEnabled,
} = betSlice.actions;
export default betSlice.reducer;
