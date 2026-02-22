import { createSlice } from '@reduxjs/toolkit';

const cropImageSlice = createSlice({
  name: 'cropImageSlice',
  initialState: {
    croppedImage: null,
    croppedImageFileType: null,

    serviceCroppedImageLight: null,
    serviceCroppedImageDark: null,
  },
  reducers: {
    setCroppedImage: (state, action) => {
      state.croppedImage = action.payload;
    },
    setServiceCroppedImageLight: (state, action) => {
      state.serviceCroppedImageLight = action.payload;
    },
    setServiceCroppedImageDark: (state, action) => {
      state.serviceCroppedImageDark = action.payload;
    },
    setCroppedImageFileType: (state, action) => {
      state.croppedImageFileType = action.payload;
    },
  },
});

export const {
  setCroppedImage,
  setServiceCroppedImageLight,
  setServiceCroppedImageDark,
  setCroppedImageFileType,
} = cropImageSlice.actions;

export default cropImageSlice.reducer;
