import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loaded: false,
  showModal: false
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initializeApp: () => initialState,
    loadUser: (state, { payload: user }) => {
      state.user = user;
      state.loaded = true;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    endLoad: (state) => {
      state.loaded = true;
    },
    showModal: (state) => {
      state.showModal = true;
    },
    toggleModal: (state) => {
      state.showModal = !state.showModal;
    }
  }
});

export const { loadUser, logoutUser, endLoad, initializeApp, showModal, toggleModal } = slice.actions;

export default slice.reducer;
