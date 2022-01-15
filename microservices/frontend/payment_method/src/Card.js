import React from "react";

function Card(props) {
  const { card } = props;

  return (
    <table className="table table-dark">
      <thead>
        <tr>
          <th scope="col" colSpan="2">
            Numero de Tarjeta
          </th>

          <th scope="col" colSpan="2">
            Nombre
          </th>

          <th scope="col" colSpan="5">
            Fecha Expiracion
          </th>

          <th scope="col" colSpan="2">
            CVC
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colSpan="1">{card.number}</td>
          <td colSpan="4">{card.name}</td>
          <td colSpan="3">{card.expiry}</td>
          <td colSpan="3">{card.cvc}</td>

          <td colSpan="3">
            
          </td>

          <td>
            <button
              id="button1"
              className="btn2 btn-primary"
              onClick={() => props.onEdit(card)}
            >
              Editar Tarjeta
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

export default Card;
