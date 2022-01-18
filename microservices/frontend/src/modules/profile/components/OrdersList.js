import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

export function OrderList ({ orders, onViewItem }) {
  return (
    <>
      {orders.length === 0 &&
        <h4>No tienes compras. <Link to='/'><i className='fa fa-plus-circle' /> Haz una compra! </Link></h4>}
      {orders.length > 0 &&
        <Table striped>
          <thead>
            <tr>
              <th />
              <th>
                Orden #
              </th>
              <th>
                Fecha
              </th>
              <th>
                Total
              </th>
              <th>
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order =>
              <tr key={order.id}>
                <th scope='row'>
                  <Link to={'/order/' + order.id}><i className='fa fa-eye' /></Link>
                </th>
                <td>
                  {order.id}
                </td>
                <td>
                  {(new Date(order.createdAt * 1000).toLocaleString())}
                </td>
                <td>
                  ${order.total.toFixed(2)}
                </td>
                <td>
                  Completada
                </td>
              </tr>)}
          </tbody>
        </Table>}
    </>
  );
}
