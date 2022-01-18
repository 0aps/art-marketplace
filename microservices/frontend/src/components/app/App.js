import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { store } from '../../state/store';
import api from '../../api';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { Footer } from '../footer/Footer';
import { Header } from '../header/Header';
import { endLoad, loadUser, logoutUser, showModal, toggleModal } from './App.slice';
import { HomePage } from '../../modules/home/HomePage';
import { LoginPage } from '../../modules/login/LoginPage';
import { RegisterPage } from '../../modules/login/RegisterPage';
import { ConfirmationPage } from '../../modules/login/ConfirmationPage';
import { AdminPage } from '../../modules/admin/AdminPage';
import { RestorePage } from '../../modules/login/RestorePage';
import { ToastContainer } from 'react-toastify';
import { loadCart } from '../../modules/cart/Cart.slice';
import { CartPage } from '../../modules/cart/CartPage';
import { ProfilePage } from '../../modules/profile/ProfilePage';

export function App () {
  const { loaded, user, showModal } = useStoreWithInitializer(({ app }) => app, load);

  const userIsLogged = user != null;

  return (
    <HashRouter>
      {loaded && (
        <div className='d-flex flex-column min-vh-100'>
          <ToastContainer position='bottom-right' />
          <Header user={user} logout={logout} showModal={showModal} handleOpen={handleOpen} handleClose={handleClose} />
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
                  <UserOnlyRoute userIsLogged={userIsLogged && user.role === 'admin'}>
                    <AdminPage />
                  </UserOnlyRoute>
              }
              />
              <Route
                exact path='/profile' element={
                  <UserOnlyRoute userIsLogged={userIsLogged && user.role !== 'admin'}>
                    <ProfilePage />
                  </UserOnlyRoute>
              }
              />
              <Route
                exact path='/cart' element={
                  <UserOnlyRoute userIsLogged={userIsLogged && user.role === 'collector'}>
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
    if (user.role === 'collector') {
      const cart = await api.cart.get();
      store.dispatch(loadCart(cart));
    }
    store.dispatch(loadUser(user));
  } catch {
    store.dispatch(endLoad());
  }
}

const handleClose = () => {
  store.dispatch(toggleModal());
};

const handleOpen = () => {
  store.dispatch(showModal());
};

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
