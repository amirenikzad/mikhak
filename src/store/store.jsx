import { configureStore } from '@reduxjs/toolkit';
import captchaSlice from './features/captchaSlice';
import forgetPasswordSlice from './features/forgetPasswordSlice';
import menuSlice from './features/menuSlice';
import pagesSlice from './features/pagesSlice';
import updatedSlice from './features/updatedSlice';
import cropImageSlice from './features/cropImageSlice';
import accessSlice from './features/accessSlice';
import isLoadingSlice from './features/isLoadingSlice.jsx';
import mapOrganizationSlice from './features/mapOrganizationSlice.jsx';
import baseSlice from './features/baseSlice.jsx';
import streamSlice from './features/streamSlice.jsx';
import walletSlice from './features/walletSlice.jsx';
import newOptionsSlice from './features/newOptionsSlice.jsx';
import ticketSlice from './features/ticketSlice.jsx';

export const store = configureStore({
  reducer: {
    captchaSlice: captchaSlice,
    forgetPasswordSlice: forgetPasswordSlice,
    menuSlice: menuSlice,
    pagesSlice: pagesSlice,
    updatedSlice: updatedSlice,
    cropImageSlice: cropImageSlice,
    accessSlice: accessSlice,
    isLoadingSlice: isLoadingSlice,
    mapOrganizationSlice: mapOrganizationSlice,
    baseSlice: baseSlice,
    streamSlice: streamSlice,
    walletSlice: walletSlice,
    newOptionsSlice: newOptionsSlice,
    ticketSlice: ticketSlice,
  },
});
