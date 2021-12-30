import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedPaymentMethod: null,
  paymentMethods: [],
  loaded: false
};

const slice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    initializeApp: () => initialState,
    selectPaymentMethod: (state, { payload: paymentMethod }) => {
      state.selectedPaymentMethod = paymentMethod;
    },
    loadPaymentMethods: (state, { payload: paymentMethods }) => {
      state.paymentMethods = paymentMethods;
      state.loaded = true;
    },
    cleanPaymentMethod: (state) => {
      state.selectedPaymentMethod = null;
    }
  }
});

export const { loadPaymentMethods, selectPaymentMethod, cleanPaymentMethod, initializeApp } = slice.actions;

export default slice.reducer;
