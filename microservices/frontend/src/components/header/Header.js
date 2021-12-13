import { ProfileNavBar } from '../profile-navbar/ProfileNavBar';
import { useStore } from '../../state/storeHooks';

export function Header () {
  const { user } = useStore(({ app }) => app);
  return <ProfileNavBar user={user} />;
}
