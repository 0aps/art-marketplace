import { Link } from 'react-router-dom';
import {
  NavbarBrand, Navbar, Nav, NavItem, NavLink,
  UncontrolledDropdown, DropdownItem, DropdownMenu,
  DropdownToggle, NavbarToggler, Collapse
} from 'reactstrap';

export function NavBar ({ user }) {
  return (
    <Navbar
      color='dark'
      dark
      expand='lg'
    >
      <NavbarBrand tag={Link} to='/' className='menu-item'>
        <span>Art Marketplace</span>
      </NavbarBrand>
      <NavbarToggler onClick={function noRefCheck () {
      }}
      />
      <Collapse navbar>
        <Nav
          className='me-auto'
          navbar
        >
          <NavItem>
            <NavLink tag={Link} to='/'>
              Inicio
            </NavLink>
          </NavItem>
        </Nav>
        <Nav navbar>
          {user ? <UserLinks user={user} /> : <GuestLinks />}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

function GuestLinks () {
  return (
    <>
      <NavLink tag={Link} to='/login'>
        Inicia sesión
      </NavLink>
      <NavLink tag={Link} to='/register'>
        Regístrate
      </NavLink>
    </>
  );
}

function UserLinks ({ user }) {
  return (
    <>
      <NavItem>
        <div className='profile-picture'>
          <img
            className='pp-user'
            src='images/profile_placeholder.svg' alt='profile'
          />
        </div>
      </NavItem>
      <UncontrolledDropdown nav>
        <DropdownToggle nav caret>
          <span>{user.username}</span>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <Link to='/admin'>
              Administración
            </Link>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>Salir</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  );
}
