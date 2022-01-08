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
import { useState } from 'react';
import React from 'react';

export function App () {
  const { loading, user } = useStoreWithInitializer(({ app }) => app, load);
  const [parentCallBack, setParentCallBack] = useState(false)

  const onTrigger = (event) => {
    event.preventDefault()
    setParentCallBack(!parentCallBack)
  }

  const userIsLogged = user != null;

  return (
    <HashRouter>
      {!loading && (
        <>
          <ToastContainer />
          <Header user={user} logout={logout} onTrigger={onTrigger} parentCallBack={parentCallBack} setParentCallBack={setParentCallBack}/>
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

  try {
    store.dispatch(loadUser(await api.identity.me()));
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
