import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menuSlice',
  initialState: {
    transparency_level: 60,
    is_expanded_menu: false,
  },
  reducers: {
    setTransparencyLevel(state, action) {
      state.transparency_level = action.payload ? action.payload : 0;
    },
    setIsExpandedMenu(state, action) {
      state.is_expanded_menu = action.payload;
    },
  },
});

export const {
  setTransparencyLevel,
  setIsExpandedMenu,
} = menuSlice.actions;

export default menuSlice.reducer;
