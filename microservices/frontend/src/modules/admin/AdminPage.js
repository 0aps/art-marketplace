import { useEffect, useState } from 'react';
import api from '../../api';
import { Container} from 'reactstrap';
import { ListUser } from './components/ListUser';
import { toast } from 'react-toastify';


export function AdminPage () {
  const [state, setState] = useState({
    loaded: false,
    users: []
  });

  useEffect(() => {
    loadUsers({ state, setState });
  }, []);

  async function onUserDelete ({ user }) {
    setState((state) => ({ ...state, loaded: false }));
    try {
        await api.identity.delete(user.id);
        setState((state) => ({users: state.users.filter((u) => u.id !== user.id), loaded: true }));
    } catch (e) {
      setState((state) => ({ ...state, loaded: true }));
      toast.error(`Error al borrar el usario. ${e.message}`);
    }
  }

  async function onUserEdit (newUser, user) {
    try {
        await api.identity.put(user.id, newUser);
    } catch (e) {
      toast.error(`Error al modificar el usario. ${e.message}`);
    }
    return true;
}

  return (state.loaded
    ? <Container>
    <ListUser users={state.users} onDelete={(user) => onUserDelete({user})} onEdit={(newUser, user) => onUserEdit(newUser, user)} />
  </Container>
    : <div className='loader' />);;
}

async function loadUsers ({ state, setState }) {
  setState((state) => ({ ...state, loaded: false }));
  try {
    const records = await api.identity.list();
    setState((state) => ({users: records, loaded: true }));
  } catch (e) {
    setState((state) => ({ ...state, loaded: true }));
    toast.error(`Error al cargar los usarios. ${e.message}`);
  }
}