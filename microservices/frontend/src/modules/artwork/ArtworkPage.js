import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import { Badge, Button, Card, CardImg, Col, Container, Row } from 'reactstrap';
import { ListArtwork } from '../home/components/ListArtwork';
import { onAddToCart } from '../home/components/Dashboard';
import { store } from '../../state/store';

export function ArtworkPage () {
  const { app: { user } } = store.getState();
  const params = useParams();
  const [state, setState] = useState({
    loaded: false,
    artwork: null,
    certificate: null,
    recommended: []
  });

  useEffect(() => {
    loadArtwork({ id: params.slug, setState });
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
            <h1>{state.artwork.name}</h1>
            <Card className='p-4'>
              <Row>
                <Col md={4}>
                  <CardImg
                    className='artwork-card-image'
                    alt='Card image cap'
                    src={state.artwork.defaultPicture?.path ?? 'https://picsum.photos/318/180'}
                    top
                  />
                </Col>
                <Col md={8}>
                  <h3 className='bold text-success'>${state.artwork.price.toFixed(2)}</h3>
                  <dl>
                    <dt>Descripción</dt>
                    <dd className='mx-3'>
                      <h5>{state.artwork.description}</h5>
                    </dd>
                    <dt>Artista</dt>
                    <dd>
                      <Badge
                        color='info mx-3'
                        href='#'
                      > {state.artwork.user.username}
                      </Badge>
                    </dd>
                    <dt>Categoría</dt>
                    <dd>
                      <Badge
                        color='info mx-3'
                        href='#'
                      > {state.artwork.category.name}
                      </Badge>
                    </dd>
                    <dt>Fecha</dt>
                    <dd>
                      <Badge
                        color='info mx-3'
                        href='#'
                      > {(new Date(state.artwork.createdAt * 1000).toLocaleDateString())}
                      </Badge>
                    </dd>
                  </dl>
                  {(user != null && user.role === 'artist' && state.certificate == null) &&
                    <Button
                      className='btn btn-sm btn-primary float-end'
                      onClick={() => createCertificate(state.artwork, setState)}
                    >
                      <h5><i className='fa fa fa-file' aria-hidden='true'> Crear certificado</i></h5>
                    </Button>}
                  {state.certificate != null &&
                    <Button
                      className='btn btn-sm btn-primary float-end'
                      onClick={() => showCertificate(state.artwork, state.certificate.id, setState)}
                    >
                      <h5><i className='fa fa fa-file' aria-hidden='true'> Ver certificado</i></h5>
                    </Button>}
                  <Button
                    className='btn btn-sm btn-success float-end mx-3'
                    onClick={() => onAddToCart(state.artwork)}
                  >
                    <h5><i className='fa fa-cart-plus' aria-hidden='true'> Añadir al carrito</i></h5>
                  </Button>
                </Col>
              </Row>
            </Card>
            <div id='recommended' className='my-4'>
              {(state.recommended && state.recommended.length > 0) && <h3>Otras obras del artista</h3>}
              <ListArtwork artworks={state.recommended} onAddToCart={onAddToCart} />
            </div>
          </Col>
        </Row>
      </Container>
      </>
    : <div className='loader' />);
}

async function loadArtwork ({ id, setState }) {
  setState((state) => ({ ...state, loaded: false }));
  try {
    const artwork = await api.artwork.get(id);
    const { records: recommended } = await loadRecommended(artwork.user.id);
    const certificate = await loadCertificate(artwork.name);

    setState((state) => ({
      ...state,
      artwork: artwork,
      recommended: recommended.filter(r => r.id !== id),
      certificate: certificate,
      loaded: true
    }));
  } catch (e) {
    setState((state) => ({ ...state, loaded: true }));
    toast.error(`Error al cargar la obra. ${e.message}`);
  }
}

async function loadRecommended (userId) {
  return api.artwork.list({
    user: userId,
    perPage: 3
  });
}

async function loadCertificate (artworkName) {
  try {
    const certificates = await api.certificate.list();
    let certificate = null;

    certificates.forEach(element => {
      if (element.artName === artworkName) {
        certificate = element;
      }
    });

    return certificate;
  } catch (error) {
    toast.error(`Error al cargar el certificado. ${error.message}`);
    return null;
  }
}

async function createCertificate (artwork, setState) {
  try {
    const data = {
      artName: artwork.name,
      artDescription: artwork.description,
      artCreationDate: artwork.createdAt,
      categoryName: artwork.category.name,
      username: artwork.user.username
    };
    await api.certificate.create(data);

    toast.success('Certificado creado exitosamente.');
    await loadArtwork({ id: artwork.id, setState });
  } catch (error) {
    toast.error(`Error al crear el certificado. ${error.message}`);
    setState((state) => ({ ...state, loaded: true }));
  }
}

async function showCertificate (artwork, certificateId, setState) {
  try {
    window.open(`api/v1/certificates/${certificateId}`, '_blank', 'fullscreen=yes');
    toast.success('Certificado visualizado exitosamente.');
  } catch (error) {
    toast.error(`Error al cargar el certificado. ${error.message}`);
    setState((state) => ({ ...state, loaded: true }));
  }
}
