import { CardBody, CardHeader } from 'reactstrap';
import { CartItemList } from './ShoppingCart';

export function ReviewConfirm ({ items, selectedPaymentMethod }) {
  return (
    <>
      <CardHeader>
        <h4><i className='fa fa-check-circle' /> Confirmar</h4>
      </CardHeader>
      <CardBody>
        <h4>Resumen</h4>
        <CartItemList items={items} />
        <h4>Detalle de pago</h4>
        <div className='mx-3'>
          {!selectedPaymentMethod && <p>Selecciona un método de pago ... </p>}
          {selectedPaymentMethod &&
            <p>Tarjeta terminada en<span className='badge bg-info mx-1'>{selectedPaymentMethod.last4}</span>
            </p>}
        </div>
      </CardBody>
    </>
  );
}
