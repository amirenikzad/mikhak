import { createSlice } from '@reduxjs/toolkit';

const isLoadingSlice = createSlice({
  name: 'isLoadingSlice',
  initialState: {
    isFetchingPermission: false,
    isFetchingRegister: false,
    isFetchingLogin: false,
    isFetchingResetPassword: false,
    isFetchingForgetPassword: false,
    isFetchingRole: false,
    isFetchingApis: false,
    isFetchingUserInfo: false,
    isFetchingOrganization: false,
    isFetchingOrganizationType: false,
    isFetchingComponents: false,

    isDeleting: false,
    isSuspending: false,
  },
  reducers: {
    setIsFetchingPermission: (state, action) => {
      state.isFetchingPermission = action.payload;
    },
    setIsFetchingRegister: (state, action) => {
      state.isFetchingRegister = action.payload;
    },
    setIsFetchingLogin: (state, action) => {
      state.isFetchingLogin = action.payload;
    },
    setIsFetchingResetPassword: (state, action) => {
      state.isFetchingResetPassword = action.payload;
    },
    setIsFetchingForgetPassword: (state, action) => {
      state.isFetchingForgetPassword = action.payload;
    },
    setIsFetchingRole: (state, action) => {
      state.isFetchingRole = action.payload;
    },
    setIsFetchingApis: (state, action) => {
      state.isFetchingApis = action.payload;
    },
    setIsFetchingUserInfo: (state, action) => {
      state.isFetchingUserInfo = action.payload;
    },
    setIsFetchingOrganization: (state, action) => {
      state.isFetchingOrganization = action.payload;
    },
    setIsFetchingOrganizationType: (state, action) => {
      state.isFetchingOrganizationType = action.payload;
    },
    setIsFetchingComponents: (state, action) => {
      state.isFetchingComponents = action.payload;
    },


    setIsDeleting: (state, action) => {
      state.isDeleting = action.payload;
    },
    setIsSuspending: (state, action) => {
      state.isSuspending = action.payload;
    },
  },
});

export const {
  setIsFetchingPermission,
  setIsFetchingRegister,
  setIsFetchingLogin,
  setIsFetchingResetPassword,
  setIsFetchingForgetPassword,
  setIsFetchingRole,
  setIsFetchingApis,
  setIsFetchingUserInfo,
  setIsFetchingOrganization,
  setIsFetchingOrganizationType,
  setIsFetchingComponents,

  setIsDeleting,
  setIsSuspending,
} = isLoadingSlice.actions;

export default isLoadingSlice.reducer;
