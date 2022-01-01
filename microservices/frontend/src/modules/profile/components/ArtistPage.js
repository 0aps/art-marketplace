import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../api';
import {
  Card,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent, Table,
  TabPane
} from 'reactstrap';
import { Link } from 'react-router-dom';

export function ArtistPage ({ user }) {
  const [state, setState] = useState({
    loaded: false,
    artworks: []
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
                  <NavLink className='active'>Mis obras</NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab='1' className='py-4 px-2'>
                <TabPane tabId='1'>
                  <Row>
                    <Col md={12}>
                      <ArtworkList
                        artworks={state.artworks}
                        onEditItem={onEditItem}
                        onRemoveItem={onRemoveItem}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <div className='float-start'><Link to='/'><i className='fa fa-plus-circle' /> Agregar obra</Link></div>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
    : <div className='loader' />
  )
  ;
}

function ArtworkList ({ artworks, onEditItem, onRemoveItem }) {
  return (
    <>
      {artworks.length === 0 &&
        <h4>No tienes obras creadas. Agrega una! </h4>}
      {artworks.length > 0 &&
        <Table striped>
          <thead>
            <tr>
              <th />
              <th>
                Obra
              </th>
              <th>
                Precio
              </th>
              <th>
                Categoría
              </th>
              <th>
                Creada en
              </th>
            </tr>
          </thead>
          <tbody>
            {artworks.map(item =>
              <tr key={item.id}>
                <th scope='row'>
                  <a
                    className='pointer'
                    onClick={() => onEditItem(item)}
                  >
                    <span><i className='fa fa-edit' /></span>
                  </a>
                  <a
                    className='pointer'
                    onClick={() => onRemoveItem(item)}
                  >
                    <span><i className='fa fa-trash' /></span>
                  </a>
                </th>
                <td>
                  {item.name}
                </td>
                <td>
                  ${item.price.toFixed(2)}
                </td>
                <td>
                  {item.category.name}
                </td>
                <td>
                  {(new Date(item.createdAt * 1000).toLocaleDateString())}
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
    const { records } = await api.artwork.list({
      user: user.id
    });
    setState((state) => ({ ...state, artworks: records, loaded: true }));
  } catch (e) {
    toast.error(`Error al cagar la información del usuario. ${e.message}`);
    setState((state) => ({ ...state, loaded: true }));
  }
}

async function onEditItem ({ item }) {

}

async function onRemoveItem ({ item }) {

}
