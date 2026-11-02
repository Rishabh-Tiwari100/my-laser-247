import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '@/store/api/userApi';
import { Wallet } from '@/types/user';

interface WalletInfo {
  mainBalance: number;
  bonusBalance: number;
  exposure: number;
  lockedAmount: number;
  withdrawableBalance: number;
  depositBalance: number;
}

const initialState: WalletInfo = {
  mainBalance: 0,
  bonusBalance: 0,
  exposure: 0,
  lockedAmount: 0,
  withdrawableBalance: 0,
  depositBalance: 0,
};

const getSafeNumber = (value: number | string | null | undefined) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWallet: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getUserWallets.matchFulfilled, (state, { payload }) => {
      const balance = {
        mainBalance: 0,
        bonusBalance: 0,
        exposure: 0,
        lockedAmount: 0,
        withdrawableBalance: 0,
        depositBalance: 0,
      };

      Array.isArray(payload) &&
        payload?.forEach((w: Wallet) => {
          const type = w?.type ? w?.type?.toLowerCase() : '';
          if (type === 'main') {
            balance.mainBalance = getSafeNumber(w.amount);
            balance.exposure = getSafeNumber(w.exposureAmount);
            balance.lockedAmount = getSafeNumber(w.lockedAmount);
            balance.withdrawableBalance = getSafeNumber(w.withdrawableBalance);
            balance.depositBalance = getSafeNumber(w.depositBalance);
          } else if (type === 'bonus') {
            balance.bonusBalance = getSafeNumber(w.amount);
          }
        });

      return balance;
    });
  },
});

export const { resetWallet } = walletSlice.actions;
export default walletSlice.reducer;
