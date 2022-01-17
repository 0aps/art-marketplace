import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import { Badge, Button, Card, CardImg, Col, Container, Row } from 'reactstrap';
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
                <Col md={4}>
                  <CardImg
                    className='artwork-card-image'
                    alt='Card image cap'
                    src='https://picsum.photos/318/180'
                    top
                  />
                </Col>
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
    //const artworks = await loadArtworks(order.cart);
    //setState((state) => ({ ...state, order: order, artworks: artworks, loaded: true }));
    setState((state) => ({ ...state, order: order, loaded: true }));
  } catch (e) {
    setState((state) => ({ ...state, loaded: true }));
    toast.error(`Error al cargar el pedido. ${e.message}`);
  }
}

async function loadArtworks (id) {
  const cart = await api.cart.get(id);
  const artworks = cart.items;

  return artworks;
}
