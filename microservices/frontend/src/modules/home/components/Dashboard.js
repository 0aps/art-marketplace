import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from 'react-toastify';
import { ListArtwork } from './ListArtwork';
import { Container, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { store } from '../../../state/store';
import { addItem } from '../../cart/Cart.slice';

export function Dashboard () {
  const [state, setState] = useState({
    loaded: false,
    artworks: [],
    page: 0,
    perPage: 10,
    pages: 1
  });

  useEffect(() => {
    loadArtworks({ state, setState });
  }, [state.page]);

  return (state.loaded
    ? <Container>
      <ListArtwork artworks={state.artworks} onAddToCart={onAddToCart} />
      <Pagination listClassName='justify-content-center'>
        <PaginationItem>
          <PaginationLink
            onClick={() => setState(state => ({ ...state, page: 0 }))}
            first
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => setState(state => ({ ...state, page: Math.max(0, state.page - 1) }))}
            previous
          />
        </PaginationItem>
        {[...Array(state.pages).keys()].map(page =>
          <PaginationItem key={page} active={state.page === page}>
            <PaginationLink onClick={() => setState(state => ({ ...state, page: page }))}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            onClick={() => setState(state => ({ ...state, page: Math.min(state.page + 1, state.pages - 1) }))}
            next
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => setState(state => ({ ...state, page: state.pages - 1 }))}
            last
          />
        </PaginationItem>
      </Pagination>
    </Container>
    : <div className='loader' />);
}

async function loadArtworks ({ state, setState }) {
  setState((state) => ({ ...state, loaded: false }));
  try {
    const { records, pages } = await api.artwork.list({
      page: state.page,
      perPage: state.perPage
    });
    setState((state) => ({ ...state, pages: Math.ceil(pages), artworks: records, loaded: true }));
  } catch (e) {
    setState((state) => ({ ...state, loaded: true }));
    toast.error(`Error al cargar las obras de arte. ${e.message}`);
  }
}

async function onAddToCart (item) {
  const { app: { user }, cart: { id, items } } = store.getState();
  const userIsLogged = user != null;

  if (userIsLogged) {
    if (items.some($item => $item.id === item.id)) {
      toast.error('Ya has agregado esta obra.');
    } else {
      await api.cart.update(id, { item: item });
      store.dispatch(addItem(item));
      toast.success(`Se agregó la obra '${item.name}' al carrito.`);
    }
  } else {
    location.hash = '#/login';
  }
}
