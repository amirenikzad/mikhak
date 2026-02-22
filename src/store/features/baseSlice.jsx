import { createSlice } from '@reduxjs/toolkit';

const baseSlice = createSlice({
  name: 'baseSlice',
  initialState: {
    appVersion: `2.9.154-beta`,
    breadcrumbAddress: [],
  },
  reducers: {
    setAppVersion: (state, action) => {
      state.appVersion = action.payload;
    },
    setBreadcrumbAddress: (state, action) => {
      state.breadcrumbAddress = action.payload;
    },
  },
});

export const {
  setAppVersion,
  setBreadcrumbAddress,
} = baseSlice.actions;

export default baseSlice.reducer;
