import { useState } from "react";

export function EditUser ({ user, onDelete, onSave}) {
    const [username, setUsername] = useState(user.username);
    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [role, setRole] = useState(user.role);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.info.phone);
    const [address, setAddress] = useState(user.info.address);


    return (
        <tr>
            <th>{user.username}</th>
            <td><input className="form-control" name="firstname" value={firstname} onChange={(event) => setFirstname(event.target.value)}/></td>
            <td><input className="form-control" name="lastname" value={lastname} onChange={(event) => setLastname(event.target.value)}/></td>
            <td>{user.role}</td>
            <td>{user.email}</td>
            <td>{user.info.phone}</td>
            <td>{user.info.address}</td> 
            <td>
                <button className="btn btn-primary" onClick={() => onSave({
                    firstname: firstname,
                    lastname: lastname
                })}>Guardar</button>
                <button className="btn btn-primary" onClick={() => onDelete(user)}>Borrar</button>
            </td> 
        </tr>
    )
}