import { createSlice } from '@reduxjs/toolkit';

const streamSlice = createSlice({
  name: 'streamSlice',
  initialState: {
    ip: '',
    port: '',
    path: '',
    isOpenModal: false,
    elapse_time: 0,
    // selectedDevops: null,

  },
  reducers: {
    setIP(state, action) {
      state.ip = action.payload;
    },
    setPort(state, action) {
      state.port = action.payload;
    },
    setPath(state, action) {
      state.path = action.payload;
    },
    onOpenModal(state) {
      state.isOpenModal = true;
    },
    onCloseModal(state) {
      state.isOpenModal = false;
    },
    setElapseTime(state, action) {
      state.elapse_time = action.payload;
    },
    // setSelectedDevops: (state, action) => {
    //   state.selectedDevops = action.payload;
    // },

  },
});

export const {
  setIP,
  setPort,
  setPath,
  onOpenModal,
  onCloseModal,
  setElapseTime,
  // setSelectedDevops,
} = streamSlice.actions;

export default streamSlice.reducer;
