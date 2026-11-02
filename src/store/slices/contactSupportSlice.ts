import { ContactSupportResponse } from '@/types/user';
import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../api/userApi';

interface ContactSupportState {
  data: ContactSupportResponse | null;
}

const initialState: ContactSupportState = {
  data: null,
};

const contactSupportSlice = createSlice({
  name: 'contactSupport',
  initialState,
  reducers: {
    clearContactSupport(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getContactSupport.matchFulfilled, (state, { payload }) => {
      state.data = payload;
    });
  },
});

export const { clearContactSupport } = contactSupportSlice.actions;
export default contactSupportSlice.reducer;
