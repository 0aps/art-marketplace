import { PurchasedArtworkThumbnail } from './PurchasedArtworkThumbnail';
import classNames from 'classnames';

export function ListPurchasedArtwork ({ artworks, className }) {
  return (
    <div className={classNames('grid-container', className)}>
      {artworks.map(artwork => <PurchasedArtworkThumbnail key={artwork.id} artwork={artwork} />)}
    </div>
  );
}
