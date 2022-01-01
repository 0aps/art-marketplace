import { Dashboard } from './components/Dashboard';
import { ArtworkPage } from '../artwork/ArtworkPage';
import { Routes, Route } from 'react-router-dom';

export function HomePage () {
  return (
    <Routes>
      <Route exact path='/' element={<Dashboard />} />
      <Route path='/artwork/:slug' element={<ArtworkPage />} />
    </Routes>
  );
}
