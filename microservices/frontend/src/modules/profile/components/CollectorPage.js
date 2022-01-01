import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from 'react-toastify';
import { Card, Col, Container, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane } from 'reactstrap';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

export function CollectorPage ({ user }) {
  const [state, setState] = useState({
    loaded: false,
    orders: [],
    paymentMethods: [],
    activeTab: 1
  });

  useEffect(() => {
    load({ user, setState });
  }, [null]);

  return (state.loaded
    ? <>
      <Container fluid className='py-5'>
        <Row>
          <Col
            md={{
              offset: 1,
              size: 10
            }}
          >
            <h1><i className='fa fa-user-circle' /> Mi cuenta</h1>
            <Card className='p-4'>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classNames({ active: state.activeTab === 1 })}
                    onClick={() => setState((state) => ({ ...state, activeTab: 1 }))}
                  >
                    Mis compras
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classNames({ active: state.activeTab === 2 })}
                    onClick={() => setState((state) => ({ ...state, activeTab: 2 }))}
                  >
                    Métodos de pago
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={state.activeTab} className='py-4 px-2'>
                <TabPane tabId={1}>
                  <Row>
                    <Col md={12}>
                      <OrderList orders={state.orders} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId={2}>
                  <Row>
                    <Col md={12}>
                      <PaymentMethodList paymentMethods={state.paymentMethods} />
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
    : <div className='loader' />);
}

function OrderList ({ orders, onViewItem }) {
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
                  <a
                    className='pointer'
                    onClick={() => onViewItem(order)}
                  >
                    <span><i className='fa fa-eye' /></span>
                  </a>
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

function PaymentMethodList ({ paymentMethods, onRemoveItem }) {
  return (
    <>
      {paymentMethods.length === 0 &&
        <h4>No tienes métodos de pagos. <Link to='/'><i className='fa fa-plus-circle' /> Agrega uno! </Link></h4>}
      {paymentMethods.length > 0 &&
        <Table striped>
          <thead>
            <tr>
              <th />
              <th>
                Últimos 4 dígitos
              </th>
              <th>
                Dirección
              </th>
              <th>
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map(paymentMethod =>
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
                  {paymentMethod.last4}
                </td>
                <td />
                <td>
                  {(new Date(paymentMethod.createdAt * 1000).toLocaleString())}
                </td>
              </tr>)}
          </tbody>
        </Table>}
    </>
  );
}

async function load ({ user, setState }) {
  setState((state) => ({ ...state, loaded: false }));
  try {
    const orders = await api.order.list({ user: user.id });
    const paymentMethods = await api.payment.getPaymentMethods();
    setState((state) => ({ ...state, orders, paymentMethods, loaded: true }));
  } catch (e) {
    toast.error(`Error al cagar la información del usuario. ${e.message}`);
    setState((state) => ({ ...state, loaded: true }));
  }
}
