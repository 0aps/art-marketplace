import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import { Badge, Card, Col, Container, Row } from 'reactstrap';
import { ListPurchasedArtwork } from './components/ListPurchasedArtworks';

export function OrderPage () {
  const params = useParams();
  const [state, setState] = useState({
    loaded: false,
    order: null,
    artworks: []
  });

  useEffect(() => {
    loadOrder({ id: params.slug, setState });
  }, [params.slug]);

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
            <h1>Pedido #{state.order._id}</h1>
            <Card className='p-4'>
              <Row>
                <Col md={8}>
                  <h3 className='bold text-success'>Coste total: ${state.order.total.toFixed(2)}</h3>
                  <dl>
                    <dt>Fecha</dt>
                    <dd>
                      <Badge
                        color='info mx-3'
                        href='#'
                      > {(new Date(state.order.createdAt * 1000).toLocaleDateString())}
                      </Badge>
                    </dd>
                  </dl>
                </Col>
              </Row>
            </Card>
            <div id='cartOrder' className='my-4'>
              <h3>Obras incluidas en el pedido</h3>
              <ListPurchasedArtwork artworks={state.artworks} />
            </div>
          </Col>
        </Row>
      </Container>
      </>
    : <div className='loader' />);
}

async function loadOrder ({ id, setState }) {
  setState((state) => ({ ...state, loaded: false }));
  try {
    const order = await api.order.get(id);
    const artworks = order.cart.items;
    setState((state) => ({ ...state, order: order, artworks: artworks, loaded: true }));
  } catch (e) {
    setState((state) => ({ ...state, loaded: true }));
    toast.error(`Error al cargar el pedido. ${e.message}`);
  }
}
