import { EditableUser} from './EditableUser';
import api from '../../../api';

export function ListUser ({ users, onDelete, onEdit }) {

    return (
        <table class="table">
            <thead>
                <tr>
                    <th>Usario</th>
                    <th>Nombre</th>
                    <th>Appellido</th>
                    <th>Rol</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) =>
                    <EditableUser key={user.username} user={user} onDelete={onDelete} onEdit={onEdit}/>
                )}
            </tbody>
        </table>
    );
  }