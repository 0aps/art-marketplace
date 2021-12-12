import axios from 'axios';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { store } from '../../state/store';
import api from '../../api';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { endLoad, loadUser } from './App.slice';
import { HomePage } from '../../modules/home/HomePage';
import { LoginPage } from '../../modules/login/LoginPage';
import { RegisterPage } from '../../modules/login/RegisterPage';
import { AdminPage } from '../../modules/admin/AdminPage';
import { RestorePage } from '../../modules/login/RestorePage';

export function App () {
  const { loading, user } = useStoreWithInitializer(({ app }) => app, load);

  const userIsLogged = user != null;

  return (
    <HashRouter>
      {!loading && (
        <>
          <Header />
          <Routes>
            <Route
              exact path='/login' render={
                <GuestOnlyRoute serIsLogged={userIsLogged}>
                  <LoginPage />
                </GuestOnlyRoute>
            }
            />
            <Route
              exact path='/register' render={
                <GuestOnlyRoute userIsLogged={userIsLogged}>
                  <RegisterPage />
                </GuestOnlyRoute>
            }
            />
            <Route
              exact path='/restore/:key' render={
                <GuestOnlyRoute userIsLogged={userIsLogged}>
                  <RestorePage />
                </GuestOnlyRoute>
            }
            />
            <Route
              exact path='/admin' render={
                <UserOnlyRoute userIsLogged={userIsLogged}>
                  <AdminPage />
                </UserOnlyRoute>
            }
            />
            <Route exact path='/*' element={<HomePage />} />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
          <Footer />
        </>
      )}
    </HashRouter>
  );
}

async function load () {
  const token = localStorage.getItem('token');
  if (!store.getState().app.loading || !token) {
    store.dispatch(endLoad());
    return;
  }
  axios.defaults.headers.Authorization = `Token ${token}`;

  try {
    store.dispatch(loadUser(await api.identity.me()));
  } catch {
    store.dispatch(endLoad());
  }
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
