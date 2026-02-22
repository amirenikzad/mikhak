import { createSlice } from '@reduxjs/toolkit';

const forgetPasswordSlice = createSlice({
  name: 'forgetPasswordSlice',
  initialState: {
    email: { value: '', isInvalid: false },
  },
  reducers: {
    setEmail: (state, action) => {
      const { value, isInvalid } = action.payload;
      state.email = {
        ...state.email,
        value,
        isInvalid,
      };
    },
  },
});

export const { setEmail } = forgetPasswordSlice.actions;

export default forgetPasswordSlice.reducer;
