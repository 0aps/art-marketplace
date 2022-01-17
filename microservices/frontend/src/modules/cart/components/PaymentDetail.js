import { CardBody, CardHeader, FormGroup, Label } from 'reactstrap';
import api from '../../../api';
import { store } from '../../../state/store';
import { loadPaymentMethods, selectPaymentMethod } from '../../../components/payment-method/PaymetMethod.slice';
import { toast } from 'react-toastify';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import FieldGroup from '../../../components/field-group/FieldGroup';
import { Link } from 'react-router-dom';

export function PaymentDetail () {
  const { loaded, paymentMethods, selectedPaymentMethod } = useStoreWithInitializer(({ payment }) => payment, load);

  return (
    loaded
      ? <>
        <CardHeader>
          <h4><i className='fa fa-money' /> Detalle de pago</h4>
        </CardHeader>
        <CardBody>
          {paymentMethods.length === 0 &&
            <h4>No tienes métodos de pago agregados.
              <Link to='/profile'><i className='fa fa-plus-circle' /> Añade uno! </Link>
            </h4>}
          {paymentMethods.length > 0 &&
            <FormGroup>
              <Label for='paymentMethods'>
                Tarjeta de Crédito
              </Label>
              <FieldGroup
                id='paymentMethods'
                name='paymentMethods'
                type='select'
                value={selectedPaymentMethod?.id ?? ''}
                options={paymentMethods.map(e => ({ text: `Terminada en ${e.card.last4}`, value: e.id }))}
                required
                onChange={(event) => onPaymentMethodChange({ event, paymentMethods })}
              />
            </FormGroup>}
        </CardBody>
      </>
      : <div className='loader' />
  );
}

async function load () {
  try {
    const paymentMethods = await api.payment.getPaymentMethods();
    store.dispatch(loadPaymentMethods(paymentMethods));
  } catch (e) {
    toast.error(`Error al cargar los métodos de pago. ${e.message}`);
  }
}

function onPaymentMethodChange ({ event, paymentMethods }) {
  const paymentMethod = paymentMethods.find(record => record.id === event.target.value);
  store.dispatch(selectPaymentMethod(paymentMethod));
}
