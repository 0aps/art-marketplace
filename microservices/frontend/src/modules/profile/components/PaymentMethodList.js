import { Col, Row, Table } from 'reactstrap';
import { useState } from 'react';
import { AddPaymentMethodModal } from './AddPaymentMethod';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements } from '@stripe/react-stripe-js';
import api from '../../../api';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(process.env.STRIPE_KEY);

export function PaymentMethodList ({ paymentMethods, onRemoveItem }) {
  const [state, setState] = useState({
    showModal: false,
    paymentMethods: paymentMethods,
    loaded: true
  });

  return (state.loaded
    ? <>
      {state.showModal && <Elements stripe={stripePromise}>
        <AddPaymentMethodModal
          isOpen={state.showModal}
          onAddPaymentMethod={(params) => onAddPaymentMethod({ ...params, setState })}
          toggle={() => togglePaymentMethodModal({ setState })}
        />
      </Elements>}
      {state.paymentMethods.length === 0 &&
        <h4>No tienes métodos de pagos.</h4>}
      {state.paymentMethods.length > 0 &&
        <Table striped>
          <thead>
            <tr>
              <th />
              <th>
                Últimos 4 dígitos
              </th>
              <th>
                Fecha
              </th>
              <th>
                Por defecto
              </th>
            </tr>
          </thead>
          <tbody>
            {state.paymentMethods.map(paymentMethod =>
              <tr key={paymentMethod.id}>
                <th scope='row'>
                  <a
                    className='pointer'
                    onClick={() => onRemoveItem(paymentMethod)}
                  >
                    <span><i className='fa fa-trash' /></span>
                  </a>
                </th>
                <td>
                  {paymentMethod.card.last4}
                </td>
                <td>
                  {(new Date(paymentMethod.created * 1000).toLocaleString())}
                </td>
                <td>
                  {paymentMethod.default && <h6><i className='fa fa-check' /></h6>}
                </td>
              </tr>)}
          </tbody>
        </Table>}
      <Row className='mt-4'>
        <Col md={12}>
          <h6><a className='pointer' onClick={() => togglePaymentMethodModal({ setState })}>
            <i className='fa fa-plus-circle' /> Agregar método de pago
          </a>
          </h6>
        </Col>
      </Row>
      </>
    : <div className='loader' />);
}

function togglePaymentMethodModal ({ setState }) {
  setState(state => ({ ...state, showModal: !state.showModal }));
}

async function onAddPaymentMethod ({ event, elements, stripe, setState }) {
  event.preventDefault();
  if (elements == null) {
    return;
  }
  try {
    const { token } = await stripe.createToken(elements.getElement(CardElement));
    setState((state) => ({ ...state, loaded: false }));
    await api.payment.addPaymentMethod({ token });
    const paymentMethods = await api.payment.getPaymentMethods();
    setState((state) => ({ ...state, paymentMethods, loaded: true, showModal: false }));
  } catch (e) {
    toast.error(`Error al cagar la información del usuario. ${e.message}`);
    setState((state) => ({ ...state, loaded: true }));
  }
}
