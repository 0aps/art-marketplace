
export function User ({ user, onEdit, onDelete }) {
    return (
        <tr>
            <th>{user.username}</th>
            <td>{user.firstname}</td>
            <td>{user.lastname}</td>
            <td>{user.role}</td>
            <td>{user.email}</td>
            <td>{user.info.phone}</td>
            <td>{user.info.address}</td> 
            <td>
                <button className="btn btn-primary" onClick={() => onEdit(user)}>Editar</button>
                <button className="btn btn-primary" onClick={() => onDelete(user)}>Borrar</button>
            </td>
        </tr>
    )
}