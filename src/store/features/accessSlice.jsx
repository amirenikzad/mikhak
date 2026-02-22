import { createSlice } from '@reduxjs/toolkit';

const accessSlice = createSlice({
  name: 'accessSlice',
  initialState: {
    isAdmin: false,
    userAccess: [],
  },
  reducers: {
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    setUserAccess(state, action) {
      state.userAccess = action.payload;
    },
  },
});

export const {
  setIsAdmin,
  setUserAccess,
} = accessSlice.actions;

export default accessSlice.reducer;
