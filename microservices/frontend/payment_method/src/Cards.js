import { React, useState, Fragment } from "react";
import PaymentForms from "./PaymentForms";
import EditableCard from "./EditableCard";

function Cards(props) {
  const [cards, setCards] = useState(props.cards);

 
  //function that accepts the input fields (parametEditableCarders) of a new card
  function onAddNewCard(number, name, expiry, cvc) {
    const newCard = {
      number: number,
      name: name,
      expiry: expiry,
      cvc: cvc,
      id: cards.length,
    };

    //validating input fields

    const validation = validateCard(newCard);

    if (!validation) {
      return false;
    }

    if (cards.find((n) => n.number === newCard.number)) {
      alert("Tarjeta duplicada");
      return false;

      //Updating the array of cards by adding a new card to the list
    }

    setCards((prevCards) => {
      //cardHide(newCard.number);
      if (!prevCards.find((n) => n.number === newCard.number)) {
        return [...prevCards, newCard];
      } else {
        alert("Tarjeta duplicada");
        return prevCards;
      }
    });

    return true;
    
  }

  //function that validates all input fields
  function validateCard(newCard) {
    if (
      newCard.number === "" ||
      newCard.c_name === "" ||
      newCard.expiry === "" ||
      newCard.cvc === ""
    ) {
      alert(
        "Favor completar todos los campos antes de agregar una nueva tarjeta"
      );
      return false;
    }

    return true;
  }

  function onDeleteCard(card) {
    setCards((prevCards) => {
      return prevCards.filter((n) => n.number !== card.number);
    });
  }

  //not yet working...

  function onCardEdit(newCard, oldCard) {
    setCards((prevCards) => {
      return prevCards.map((card) =>
        card.number === oldCard.number ? newCard : card
      );
    });
    cards.number = "";
    cards.name = "";

    return true;
  }

  return (
    <Fragment>
      <table class="table">
        <tbody>
          <PaymentForms onAddNewCard={onAddNewCard} />

          <tr>
            <td>
              {cards.map((card) => (
                <EditableCard
                  key={card.number}
                  card={card}
                  onEdit={(newCard) => onCardEdit(newCard, card)}
                  onDeleteCard={onDeleteCard}
               
                />
              ))}{" "}
            </td>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
}

export default Cards;
