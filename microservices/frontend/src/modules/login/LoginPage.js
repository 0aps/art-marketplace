import { Link } from 'react-router-dom';
import { LoginContainer } from './components/LoginContainer';

export function LoginPage () {
  return (
    <LoginContainer>
      <img
        className='mb-4 logo-img' src='images/logo.png'
        alt='Logo'
      />
      <form className='form'>

        <div className='form-outline input-group mb-4'>
          <span className='input-group-text'><i className="fa fa-envelope" aria-hidden="true" /></span>
          <input
            type='email' id='email' className='form-control form-control-lg'
            placeholder='Email' required autoFocus
          />
        </div>

        <div className='form-outline input-group mb-4'>
          <span className='input-group-text'><i className="fa fa-lock" aria-hidden="true" /></span>
          <input
            type='password' id='password' className='form-control form-control-lg'
            placeholder='Contraseña' required autoComplete='true'
          />
        </div>

        <button
          className='btn btn-lg btn-success btn-block' type='submit'>
          Iniciar Sesión
        </button>

        <hr className='my-4' />
        <div>
          <Link to='/register'><span className='text-center new-account'>Regístrate</span></Link>
        </div>
        <div>
          <Link to='/forgot'><span className='text-center new-account'>¿Perdiste la contraseña?</span></Link>
        </div>
      </form>
    </LoginContainer>
  );
}
