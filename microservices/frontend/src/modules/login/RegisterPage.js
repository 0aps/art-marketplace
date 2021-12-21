import { LoginContainer } from './components/LoginContainer';
import FieldGroup from '../../components/field-group/FieldGroup';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../api';
import { store } from '../../state/store';
import { loadUser } from '../../components/app/App.slice';

export function RegisterPage () {
  const { state, onSubmit, onInputChange } = useForm({
    name: 'signup',
    onSubmit: handleOnSubmit,
    getErrorMessage,
    initState: {
      model: {
        username: '',
        password: '',
        password_confirm: '',
        email: '',
        name: '',
        lastName: '',
        phone: '',
        address: ''
      },
      error: {}
    }
  });

  return (
    <>
      <ToastContainer />
      <LoginContainer>
        <img
          className='mb-4 logo-img' src='images/logo.png'
          alt='Logo'
        />
        <form className='form' name='signup'>
          <FieldGroup
            id='username'
            name='username'
            type='text'
            placeholder='usuario'
            required autoFocus
            onChange={onInputChange}
            help={state.error.username}
          />
          <FieldGroup
            id='password'
            name='password'
            type='password'
            placeholder='contraseña'
            required
            autoComplete='true'
            min='6'
            onChange={onInputChange}
            help={state.error.password}
          />
          <FieldGroup
            id='password_confirm'
            name='password_confirm'
            type='password'
            placeholder='confirma contraseña'
            required
            autoComplete='true'
            min='6'
            onChange={onInputChange}
            help={state.error.password_confirm}
          />
          <FieldGroup
            id='email'
            name='email'
            type='email'
            placeholder='correo@email.com'
            required
            onChange={onInputChange}
            help={state.error.email}
          />
          <FieldGroup
            id='name'
            name='name'
            type='text'
            placeholder='nombre'
            required
            onChange={onInputChange}
            help={state.error.name}
          />
          <FieldGroup
            id='lastName'
            name='lastName'
            type='text'
            placeholder='apellido'
            required
            onChange={onInputChange}
            help={state.error.lastName}
          />
          <FieldGroup
            id='phone'
            name='phone'
            type='tel'
            placeholder='teléfono'
            required
            maxLength='15'
            onChange={onInputChange}
            help={state.error.phone}
          />
          <FieldGroup
            id='address'
            name='address'
            type='text'
            placeholder='dirección completa ...'
            onChange={onInputChange}
          />
          <Button onClick={onSubmit} color='success' className='btn-lg col-12 my-3'>¡Regístrame!</Button>
          <hr className='my-4' />
          <Link to='/login'><span className='text-center new-account'>¿ya tienes una cuenta?</span></Link>
        </form>
      </LoginContainer>
    </>

  );
}

async function handleOnSubmit ({ state }) {
  try {
    const user = await api.identity.signup(state.model);
    location.hash = '#/';
    store.dispatch(loadUser(user));
  } catch (e) {
    toast.error('Error al registrarte. Por favor, trata otra vez.');
  }
}

function getErrorMessage ({ name, value, element, state }) {
  const error = [];

  switch (name) {
    case 'username':
      if (value && value.length > 20) {
        error.push('El usuario no puede tener más de 20 caracteres.');
      }
      break;
    case 'password_confirm':
      if (value !== state.model.password) {
        error.push('Las contraseñas deben ser iguales.');
      }
      break;

    default:
      break;
  }

  return error;
}
