import { CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { store } from '../../../state/store';
import { removeItem } from '../Cart.slice';
import swal from 'sweetalert';
import api from '../../../api';

export function ShoppingCart ({ id, items }) {
  return (
    <>
      <CardHeader>
        <h4>
          <i className='fa fa-shopping-cart' /> Carrito de compra
          <span className='badge bg-info mx-3'>{items.length}</span>
        </h4>
      </CardHeader>
      <CardBody>
        <CartItemList id={id} items={items} onRemoveItem={onRemoveItem} />
      </CardBody>
    </>
  );
}

export function CartItemList ({ items, id, onRemoveItem }) {
  const AddMoreItemsLink = <Link to='/'><i className='fa fa-plus-circle' /> Agrega elementos</Link>;
  return (
    <>
      {items.length === 0 &&
        <h4>El carrito está vacío. {AddMoreItemsLink}! </h4>}
      {items.length > 0 &&
        <div>
          <Table striped>
            <thead>
              <tr>
                <th />
                <th>
                  Obra
                </th>
                <th>
                  Artista
                </th>
                <th>
                  Precio
                </th>
                <th>
                  Categoría
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(item =>
                <tr key={item.id}>
                  <th scope='row'>
                    {onRemoveItem && <a className='pointer' onClick={() => onRemoveItem(id, item)}>
                      <span><i className='fa fa-trash' /></span>
                    </a>}
                  </th>
                  <td>
                    {item.name}
                  </td>
                  <td>
                    {item.user.username}
                  </td>
                  <td>
                    ${item.price.toFixed(2)}
                  </td>
                  <td>
                    {item.category.name}
                  </td>
                </tr>)}
            </tbody>
          </Table>
          <Row>
            <Col md={12}>
              {onRemoveItem && <div className='float-start'>{AddMoreItemsLink}</div>}
              <div className='float-end'>
                <h4>
                  Total: {items.reduce((a, b) => a + b.price, 0).toFixed(2)}
                </h4>
              </div>
            </Col>
          </Row>

        </div>}
    </>
  );
}

async function onRemoveItem (id, item) {
  const confirm = await swal({
    title: '¿estás seguro que quieres eliminar esta obra del carrito?',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  });
  if (confirm) {
    await api.cart.delete(`${id}/${item.id}`);
    store.dispatch(removeItem(item));
  }
}
