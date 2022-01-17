import {
  Button,
  Card,
  CardFooter,
  Col,
  Container,
  Row
} from 'reactstrap';
import { useStore } from '../../state/storeHooks';
import { useState } from 'react';
import './Cart.css';
import classNames from 'classnames';
import { PaymentDetail } from './components/PaymentDetail';
import { ReviewConfirm } from './components/ReviewConfirm';
import { ShoppingCart } from './components/ShoppingCart';
import api from '../../api';
import { store } from '../../state/store';
import { toast } from 'react-toastify';
import { cleanPaymentMethod } from '../../components/payment-method/PaymetMethod.slice';
import { loadCart } from './Cart.slice';
import swal from 'sweetalert';

export function CartPage () {
  const { cart: { id, items }, payment: { selectedPaymentMethod } } = useStore(({ cart, payment }) => ({ cart, payment }));
  const [state, setState] = useState({
    loaded: true,
    step: 1
  });

  return (state.loaded
    ? <>
      <Container fluid className='py-5'>
        <Row>
          <Col
            md={{
              offset: 3,
              size: 6
            }}
          >
            <ProgressStep step={state.step} />
            <Card>
              {state.step === 1 && <ShoppingCart id={id} items={items} />}
              {state.step === 2 && <PaymentDetail />}
              {state.step === 3 &&
                <ReviewConfirm items={items} selectedPaymentMethod={selectedPaymentMethod} />}
              <CardFooter>
                <Button
                  disabled={state.step === 1}
                  onClick={() => setState(state => ({ ...state, step: state.step - 1 }))}
                >
                  Anterior
                </Button>
                <Button
                  className='float-end'
                  disabled={items.length === 0 || (state.step === 2 && !selectedPaymentMethod)}
                  onClick={() => state.step === 3
                    ? completeCheckout({ setState, id, selectedPaymentMethod, items })
                    : setState(state => ({
                      ...state,
                      step: state.step + 1
                    }))}
                >
                  {state.step === 3 ? 'Finalizar' : 'Siguiente'}
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>

      </Container>
      </>
    : <div className='loader' />
  );
}

function ProgressStep ({ step }) {
  const stepButtons = 3;
  return (
    <section>
      <div className='steps'>
        <progress id='progress' value={(step - 1) * 100 / (stepButtons - 1)} max='100' />
        <div className='step-item'>
          <Button
            className='step-button text-center done'
          >
            <h2><i className='fa fa-edit' /></h2>
          </Button>
          <div className='step-title'>
            Carrito
          </div>
        </div>
        <div className='step-item'>
          <Button
            className={classNames('step-button', 'text-center', { done: step >= 2 })}
            aria-expanded='false'
          >
            <h2 style={{ marginLeft: '-2.5px' }}><i className='fa fa-money' /></h2>
          </Button>
          <div className='step-title'>
            Detalle de pago
          </div>
        </div>
        <div className='step-item'>
          <Button
            className={classNames('step-button', 'text-center', { done: step >= 3 })}
            aria-expanded='false'
          >
            <h2><i className='fa fa-check-circle' /></h2>
          </Button>
          <div className='step-title'>
            Confirmar
          </div>
        </div>
      </div>
    </section>
  );
}

async function completeCheckout ({ setState, id, selectedPaymentMethod, items }) {
  try {
    const confirm = await swal({
      title: '¿estás seguro de proceder con la compra?',
      icon: 'info',
      buttons: true
    });
    if (confirm) {
      setState(state => ({ ...state, loaded: false }));
      const order = await api.payment.create({ paymentMethod: selectedPaymentMethod, id, items });
      setTimeout(async () => {
        const cart = await api.cart.get();
        store.dispatch(cleanPaymentMethod());
        store.dispatch(loadCart(cart));
        toast.success(`La orden ${order.id} ha sido creada exitosamente. El detalle está disponible en la sección de órdenes.`);
        location.hash = '#/';
      }, 3000);
    }
  } catch (e) {
    toast.error(`Error al realizar la compra. ${e.message}`);
  }
}
