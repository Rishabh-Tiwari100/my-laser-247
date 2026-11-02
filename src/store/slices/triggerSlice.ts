import { createSlice } from '@reduxjs/toolkit';
export type TriggerType = 'wallet' | 'event' | 'profile' | 'withdraw' | 'deposit';

interface TriggerState {
  trigger: TriggerType | null;
  triggerId: number | null;
}

const initialState: TriggerState = {
  trigger: null,
  triggerId: null,
};

const triggerSlice = createSlice({
  name: 'trigger',
  initialState,
  reducers: {
    setTriggerId: (state, action) => {
      state.triggerId = action.payload;
    },
    setTrigger: (state, action) => {
      state.trigger = action.payload;
    },
    resetTrigger: (state) => {
      state.trigger = null;
      state.triggerId = null;
    },
  },
});

export const { setTriggerId, setTrigger, resetTrigger } = triggerSlice.actions;
export default triggerSlice.reducer;
