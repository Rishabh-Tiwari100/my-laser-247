import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '@/store/api/userApi';
import { UserProfile } from '@/types/user';

interface UserState {
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getUserProfile.matchFulfilled, (state, { payload }) => {
      state.profile = payload;
    });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
