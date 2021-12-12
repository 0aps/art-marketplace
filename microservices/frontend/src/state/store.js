import { configureStore } from '@reduxjs/toolkit';
import app from '../components/App/App.slice';

export const store = configureStore({
  reducer: { app },
  devTools: {
    name: 'Artwork Marketplace'
  }
});

export function dispatchOnCall (action) {
  return () => store.dispatch(action);
}
