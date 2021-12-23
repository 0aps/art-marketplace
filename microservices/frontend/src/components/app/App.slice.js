import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: true
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initializeApp: () => initialState,
    loadUser: (state, { payload: user }) => {
      state.user = user;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    endLoad: (state) => {
      state.loading = false;
    }
  }
});

export const { loadUser, logoutUser, endLoad, initializeApp } = slice.actions;

export default slice.reducer;
