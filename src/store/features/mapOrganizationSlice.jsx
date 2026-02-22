import { createSlice } from '@reduxjs/toolkit';

const mapOrganizationSlice = createSlice({
  name: 'mapOrganizationSlice',
  initialState: {
    hasExpandedMap: true,
  },
  reducers: {
    setHasExpandedMapTrue(state) {
      state.hasExpandedMap = true;
    },
    setHasExpandedMapFalse(state) {
      state.hasExpandedMap = false;
    },
  },
});

export const {
  setHasExpandedMapTrue,
  setHasExpandedMapFalse,
} = mapOrganizationSlice.actions;

export default mapOrganizationSlice.reducer;
