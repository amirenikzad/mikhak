import {createSlice} from "@reduxjs/toolkit";

const captchaSlice = createSlice({
  name: 'captchaSlice',
  initialState: {
    id: '',
    captchaInput: '',
    captchaImage: ''
  },
  reducers: {
    setCaptchaInput: (state, action) => {
      state.captchaInput = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setCaptchaImage: (state, action) => {
      state.captchaImage = action.payload;
    },
  }
});

export const {
  setCaptchaInput,
  setId,
  setCaptchaImage,
} = captchaSlice.actions;

export default captchaSlice.reducer;
