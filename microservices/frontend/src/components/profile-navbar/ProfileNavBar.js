import { ProfileModal } from '../profile-modal/ProfileModal';
import { NavBar } from '../navbar/NavBar';

export function ProfileNavBar (props) {
  return (
    <>
      <ProfileModal user={props.user} />
      <NavBar user={props.user} />
    </>
  );
}
