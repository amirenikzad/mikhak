import { createSlice } from '@reduxjs/toolkit';

const ticketSlice = createSlice({
  name: 'ticketSlice',
  initialState: {
    reloadAgainCounts: 0,
  },
  reducers: {
    setReloadAgainCounts: (state) => {
      state.reloadAgainCounts += 1;
    },
  },
});

export const {
  setReloadAgainCounts,
} = ticketSlice.actions;

export default ticketSlice.reducer;
