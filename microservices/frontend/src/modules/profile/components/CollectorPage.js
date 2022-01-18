import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from 'react-toastify';
import { Card, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classNames from 'classnames';
import { OrderList } from './OrdersList';
import { PaymentMethodList } from './PaymentMethodList';

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
                      <PaymentMethodList
                        paymentMethods={state.paymentMethods}
                      />
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
