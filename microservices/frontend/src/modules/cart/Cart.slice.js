import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  items: [],
  loaded: false
};

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeApp: () => initialState,
    loadCart: (state, { payload: { id, items } }) => {
      state.id = id;
      state.items = items;
      state.loaded = true;
    },
    addItem: (state, { payload: item }) => {
      state.items = [...state.items, item];
    },
    removeItem: (state, { payload: itemToRemove }) => {
      state.items = state.items.filter(item => item.id !== itemToRemove.id);
    }
  }
});

export const { loadCart, addItem, removeItem, initializeApp } = slice.actions;

export default slice.reducer;
