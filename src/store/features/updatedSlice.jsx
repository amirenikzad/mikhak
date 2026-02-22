import { createSlice } from '@reduxjs/toolkit';

const updatedSlice = createSlice({
  name: 'updatedSlice',
  initialState: {
    hasUpdatedLoginUser: false,
    hasUpdatedWalletManagementTable: false,
    hasUpdatedService: false,
  },
  reducers: {
    setHasUpdatedLoginUser: (state, action) => {
      state.hasUpdatedLoginUser = action.payload;
    },
    setHasUpdatedWalletManagementTable: (state, action) => {
      state.hasUpdatedWalletManagementTable = action.payload;
    },
    setHasUpdatedService: (state, action) => {
      state.hasUpdatedService = action.payload;
    },
  },
});

export const {
  setHasUpdatedLoginUser,
  setHasUpdatedWalletManagementTable,
  setHasUpdatedService,
} = updatedSlice.actions;

export default updatedSlice.reducer;
