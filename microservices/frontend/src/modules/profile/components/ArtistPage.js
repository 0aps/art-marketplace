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
  TabContent,
  TabPane
} from 'reactstrap';
import { ArtworkList } from './ArtworkList';
import { AddArtworkModal } from './AddArtworkModal';
import swal from 'sweetalert';

export function ArtistPage ({ user }) {
  const [state, setState] = useState({
    loaded: false,
    showModal: false,
    artworks: [],
    categories: [],
    selectedItem: {}
  });

  useEffect(() => {
    load({ user, setState });
  }, [null]);

  return (state.loaded
    ? <>
      {state.showModal && <AddArtworkModal
        isOpen={state.showModal}
        categories={state.categories}
        item={state.selectedItem}
        onAddArtwork={(params) => onAddItem({ ...params, setState, user })}
        toggle={() => toggleAddArtworkModal({ setState })}
                          />}
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
                        onEditItem={(item) => onEditItem({ item, setState })}
                        onRemoveItem={(item) => onRemoveItem({ user, setState, item })}
                      />
                    </Col>
                  </Row>
                  <Row className='mt-4'>
                    <Col md={12}>
                      <h6><a className='pointer' onClick={() => toggleAddArtworkModal({ setState })}>
                        <i className='fa fa-plus-circle' /> Agregar obra
                      </a>
                      </h6>
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
    const { records } = await api.artwork.list({
      user: user.id
    });
    const categories = await api.artwork.getCategories();
    setState((state) => ({ ...state, artworks: records, categories, loaded: true }));
  } catch (e) {
    toast.error(`Error al cagar la información del usuario. ${e.message}`);
    setState((state) => ({ ...state, loaded: true }));
  }
}

function toggleAddArtworkModal ({ setState }) {
  setState(state => ({
    ...state,
    showModal: !state.showModal,
    selectedItem: !state.showModal ? {} : state.selectedItem
  }));
}

async function onAddItem ({ user, state, setState }) {
  setState((state) => ({ ...state, loaded: false }));
  try {
    if (state.model.id) {
      await api.artwork.update(state.model.id, getFormData({ ...state.model, user: user.id }));
    } else {
      await api.artwork.create(getFormData({ ...state.model, user: user.id }));
    }

    toast.success(`Obra ${state.model.id ? 'actualizada' : 'creada'} exitosamente.`);
    setState((state) => ({ ...state, showModal: false, selectedItem: {} }));
    await load({ user, setState });
  } catch (e) {
    toast.error(`Error al crear la obra de arte. ${e.message}`);
    setState((state) => ({ ...state, loaded: true }));
  }
}

async function onEditItem ({ item, setState }) {
  setState((state) => ({ ...state, selectedItem: item, showModal: true }));
}

async function onRemoveItem ({ user, setState, item }) {
  const confirm = await swal({
    title: '¿estás seguro que quieres eliminar esta obra?',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  });

  if (confirm) {
    setState((state) => ({ ...state, loaded: false }));
    try {
      await api.artwork.delete(item.id);
      toast.success('Obra eliminada exitosamente.');
      await load({ user, setState });
    } catch (e) {
      toast.error(`Error al borrar la obra. ${e.message}`);
      setState((state) => ({ ...state, loaded: true }));
    }
  }
}

function getFormData (model) {
  const formData = new FormData();
  const keys = Object.keys(model);
  keys.forEach(key => {
    formData.append(key, model[key]);
  });

  return formData;
}
