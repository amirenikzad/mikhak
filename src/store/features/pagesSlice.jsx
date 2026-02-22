import { createSlice } from '@reduxjs/toolkit';

const pagesSlice = createSlice({
  name: 'menuSlice',
  initialState: {
    page_name: '',
    tab_name: '',
  },
  reducers: {
    setPageName(state, action) {
      state.page_name = action.payload;
    },
    setTabName(state, action) {
      state.tab_name = action.payload;
    },
  },
});

export const {
  setPageName,
  setTabName,
} = pagesSlice.actions;

export default pagesSlice.reducer;
