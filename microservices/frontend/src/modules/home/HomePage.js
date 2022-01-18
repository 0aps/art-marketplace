import { Dashboard } from './components/Dashboard';
import { ArtworkPage } from '../artwork/ArtworkPage';
import { OrderPage } from '../order/OrderPage';
import { Routes, Route } from 'react-router-dom';
import { OrderPage } from '../order/OrderPage';

export function HomePage () {
  return (
    <Routes>
      <Route exact path='/' element={<Dashboard />} />
      <Route path='/artwork/:slug' element={<ArtworkPage />} />
      <Route path='/order/:slug' element={<OrderPage />} />
    </Routes>
  );
}
