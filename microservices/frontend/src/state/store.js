import { configureStore } from '@reduxjs/toolkit';
import app from '../components/app/App.slice';
import payment from '../components/payment-method/PaymetMethod.slice';
import cart from '../modules/cart/Cart.slice';

export const store = configureStore({
  reducer: { app, cart, payment },
  devTools: {
    name: 'Artwork Marketplace'
  }
});

export function dispatchOnCall (action) {
  return () => store.dispatch(action);
}
