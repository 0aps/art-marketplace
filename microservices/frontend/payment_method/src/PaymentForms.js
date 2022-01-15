import React from "react";
import Cards from "react-credit-cards";
import { useState } from "react";
import "react-credit-cards/es/styles-compiled.css";

function PaymentForms(props) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focus, setfocus] = useState("");

  //function that resets form input fields
  const resetInputField = () => {
    setNumber("");
    setName("");
    setExpiry("");
    setCvc("");
    setfocus("");
  };

  //function that adds a new card

  const onClikAddNewCard = (event) => {
    props.onAddNewCard(
      Hidecard(number),
      name,
      hideDigits(expiry),
      hideDigits(cvc)
    );

    event.preventDefault();
    //calling function that clears input values
    resetInputField();
  };

  //function that hides cvc expiration date abd cvc

  function hideDigits(number) {
    let hideNum = [];
    for (let i = 0; i < number.length; i++) {
      hideNum.push("*");
    }
    return hideNum.join("");
  }

  //function that shows last 4 digits of card number 

  function Hidecard(number) {
    let hideNum = [];
    for (let i = 0; i < number.length; i++) {
      if (i < number.length - 4) {
        hideNum.push("*");
      } else {
        hideNum.push(number[i]);
      }
    }
    return hideNum.join("");
  }

  return (
    <div className="card">
      <div className="card-body">
        <Cards
          //accessing the state of each input field
          number={number}
          name={name}
          expiry={expiry}
          cvc={cvc}
          focused={focus}
        />

        <form onSubmit={resetInputField}>
          <div className="form-group">
            <label htmlFor="number">Numero de Tarjeta</label>
            <input
              type="text"
              name="number"
              id="number"
              className="form-control"
              maxLength="16"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              onFocus={(e) => setfocus(e.target.name)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Nombre como se muestra en la tarjeta</label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              maxLength="30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={(e) => setfocus(e.target.name)}
            />
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="expiry">Fecha de Expiracion</label>
              <input
                type="text"
                name="expiry"
                id="expiry"
                value={expiry}
                className="form-control"
                onChange={(e) => setExpiry(e.target.value)}
                onFocus={(e) => setfocus(e.target.name)}
                maxLength="4"
              />
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="cvc">CVC</label>
              <input
                type="text"
                name="cvc"
                id="cvc"
                className="form-control"
                maxLength="3"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                onFocus={(e) => setfocus(e.target.name)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success btn-block"
            onClick={onClikAddNewCard}
          >
            Agregar Nueva Tarjeta
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentForms;
