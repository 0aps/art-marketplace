import { useState } from "react";
import React from "react";
import Card from "./Card";
import EditCard from "./EditCard";

function EditableCard(props) {
  const [isEditing, setIsEditing] = useState(false);

  function saveCard(card) {
    const result = props.onEdit(card);
    if (result) {
      setIsEditing(false);
    }
  }
  var cardRender;
  if (isEditing) {
    cardRender = (
      <EditCard
        card={props.card}
        onDeleteCard={props.onDeleteCard}
        onSave={saveCard}
      />
    );
  } else {
    cardRender = (
      <Card
        card={props.card}
        onDeleteCard={props.onDeleteCard}
        onEdit={() => setIsEditing(true)}
        
      />
    );
  }

  return cardRender;
}

export default EditableCard;
