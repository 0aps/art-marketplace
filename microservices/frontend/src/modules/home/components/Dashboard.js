import { useEffect, useState } from 'react';
import api from '../../../api';
import {toast} from "react-toastify";
import {ListArtwork} from "./ListArtwork";

export function Dashboard () {
  const [state, setState] = useState({
    loaded: false,
    artworks: [],
    page: 0,
    perPage: 10
  });

  useEffect(() => {
    loadArtworks({state, setState});
  }, [null]);

  return ( state.loaded ? <ListArtwork artworks={state.artworks}/> : <div className='loader' />);
}

async function loadArtworks({state, setState}) {
  setState((state) => ({ ...state, loaded: false }));
  try{
   const {records} = await api.artwork.list({
    page: state.page,
    perPage: state.perPage
  });
   setState((state) => ({ ...state, artworks: records, loaded: true }));
  }catch(e){
    setState((state) => ({ ...state, loaded: true }));
    toast.error(`Error al cargar las obras de arte. ${e.message}`);
  }
}