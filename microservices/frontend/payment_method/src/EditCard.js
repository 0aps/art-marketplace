import { React, useState } from "react";

function EditCard(props) {
  const [number, setNumber] = useState(props.card.number);
  const [name, setName] = useState(props.card.name);
  const [expiry, setExpiry] = useState(props.card.expiry);
  const [cvc, setCvc] = useState(props.card.cvc);

  const { card } = props;

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
    <table class="table table-dark">
      <thead>
        <tr>
          <th scope="col" colSpan="1">
            Numero de Tarjeta{" "}
          </th>

          <th scope="col" colSpan="1">
            Nombre
          </th>

          <th scope="col">Fecha de Expiracion</th>

          <th scope="col">CVC</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            <input
              classname="form-control"
              type="text"
              name="number"
              value={number}
              maxLength="16"
              onChange={(event) => setNumber(event.target.value)}
            ></input>
          </td>
          <td>
            <input
              type="text"
              classname="form-control"
              name="name"
              value={name}
              maxLength="30"
              onChange={(event) => setName(event.target.value)}
            ></input>
          </td>
          <td>
            <input
              type="text"
              classname="form-control"
              name="expiry"
              value={expiry}
              maxLength="4"
              onChange={(event) => setExpiry(event.target.value)}
            ></input>
          </td>
          <td>
            <input
              type="text"
              classname="form-control"
              name="cvc"
              value={cvc}
              maxLength="3"
              onChange={(event) => setCvc(event.target.value)}
            ></input>
          </td>

          <td>
            <button
              id="button1"
              className="btn2 btn-primary"
              onClick={() =>
                props.onSave({
                  number: Hidecard(number),
                  name: name,
                  expiry: hideDigits(expiry),
                  cvc: hideDigits(cvc),
                })
              }
            >
              Guardar
            </button>
          </td>
          <td>
            <button
              id="button2"
              className="btn2 btn-secondary"
              onClick={() => props.onDeleteCard(card)}
            >
              Eliminar Tarjeta
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default EditCard;
