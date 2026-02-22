import { createSlice } from '@reduxjs/toolkit';

const newOptionsSlice = createSlice({
  name: 'newOptionsSlice',
  initialState: {
    isOpen: false,
  },
  reducers: {
    onOpenNewOptionsSlice: (state) => {
      state.isOpen = true;
    },
    onCloseNewOptionsSlice: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  onOpenNewOptionsSlice,
  onCloseNewOptionsSlice
} = newOptionsSlice.actions;

export default newOptionsSlice.reducer;
