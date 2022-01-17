import { useStore } from '../../state/storeHooks';
import { ArtistPage } from './components/ArtistPage';
import { CollectorPage } from './components/CollectorPage';

export function ProfilePage () {
  const { user } = useStore(({ app }) => app);
  return user.role === 'artist' ? <ArtistPage user={user} /> : <CollectorPage user={user} />;
}
