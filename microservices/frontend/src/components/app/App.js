import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { store } from '../../state/store';
import api from '../../api';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { endLoad, loadUser, logoutUser } from './App.slice';
import { HomePage } from '../../modules/home/HomePage';
import { LoginPage } from '../../modules/login/LoginPage';
import { RegisterPage } from '../../modules/login/RegisterPage';
import { ConfirmationPage } from '../../modules/login/ConfirmationPage';
import { AdminPage } from '../../modules/admin/AdminPage';
import { RestorePage } from '../../modules/login/RestorePage';
import { ToastContainer } from 'react-toastify';
import { loadCart } from '../../modules/cart/Cart.slice';
import { CartPage } from '../../modules/cart/CartPage';

export function App () {
  const { loaded, user } = useStoreWithInitializer(({ app }) => app, load);

  const userIsLogged = user != null;

  return (
    <HashRouter>
      {loaded && (
        <div className='d-flex flex-column min-vh-100'>
          <ToastContainer position='bottom-right' />
          <Header user={user} logout={logout} />
          <main className='flex-fill'>
            <Routes>
              <Route
                exact path='/login' element={
                  <GuestOnlyRoute userIsLogged={userIsLogged}>
                    <LoginPage />
                  </GuestOnlyRoute>
              }
              />
              <Route
                exact path='/register' element={
                  <GuestOnlyRoute userIsLogged={userIsLogged}>
                    <RegisterPage />
                  </GuestOnlyRoute>
              }
              />
              <Route
                exact path='/confirmation' element={
                  <GuestOnlyRoute userIsLogged={userIsLogged}>
                    <ConfirmationPage />
                  </GuestOnlyRoute>
              }
              />
              <Route
                exact path='/restore' element={
                  <GuestOnlyRoute userIsLogged={userIsLogged}>
                    <RestorePage />
                  </GuestOnlyRoute>
              }
              />
              <Route
                exact path='/admin' element={
                  <UserOnlyRoute userIsLogged={userIsLogged}>
                    <AdminPage />
                  </UserOnlyRoute>
              }
              />
              <Route
                exact path='/cart' element={
                  <UserOnlyRoute userIsLogged={userIsLogged}>
                    <CartPage />
                  </UserOnlyRoute>
              }
              />
              <Route exact path='/*' element={<HomePage />} />
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </HashRouter>
  );
}

async function load () {
  const token = localStorage.getItem('token');
  if (store.getState().app.loaded || !token) {
    store.dispatch(endLoad());
    return;
  }

  try {
    const user = await api.identity.me();
    const cart = await api.cart.get();

    store.dispatch(loadUser(user));
    store.dispatch(loadCart(cart));
  } catch {
    store.dispatch(endLoad());
  }
}

async function logout () {
  localStorage.removeItem('token');
  location.hash = '#/login';
  store.dispatch(logoutUser());
}

function GuestOnlyRoute ({
  children,
  userIsLogged
}) {
  return !userIsLogged ? children : <Navigate to='/' />;
}

function UserOnlyRoute ({
  children,
  userIsLogged
}) {
  return userIsLogged ? children : <Navigate to='/' />;
}
