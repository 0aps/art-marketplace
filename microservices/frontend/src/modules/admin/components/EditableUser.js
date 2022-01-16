import { EditUser } from "./EditUser";
import { User } from "./User";
import { useState } from "react";

export function EditableUser ({ user, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);

    function saveUser(newUser) {
        const result = onEdit(newUser, user);
        if (result) {
            setIsEditing(false);
        }
    }

    var userRender;
    
    if (isEditing) {
        userRender = <EditUser user={user} onDelete={onDelete} onSave={saveUser}/>;
    } else {
        userRender = <User user={user} onDelete={onDelete} onEdit={() => setIsEditing(true)}/>;
    }

    return userRender;
}