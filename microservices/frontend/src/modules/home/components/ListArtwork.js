import { ArtworkThumbnail } from './ArtworkThumbnail';
import classNames from 'classnames';

export function ListArtwork ({ artworks, onAddToCart, className }) {
  return (
    <div className={classNames('grid-container', className)}>
      {artworks.map(artwork => <ArtworkThumbnail key={artwork.id} artwork={artwork} onAddToCart={onAddToCart} />)}
    </div>
  );
}
