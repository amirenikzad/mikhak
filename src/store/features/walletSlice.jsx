import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'accessSlice',
  initialState: {
    amount: false,
  },
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
  },
});

export const {
  setAmount,
} = walletSlice.actions;

export default walletSlice.reducer;
