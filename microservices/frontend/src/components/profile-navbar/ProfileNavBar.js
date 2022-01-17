import { ProfileModal } from '../profile-modal/ProfileModal';
import { NavBar } from '../navbar/NavBar';

export function ProfileNavBar (props) {
  return (
    <>
      <ProfileModal user={props.user} showModal={props.showModal} handleClose={props.handleClose}/>
      <NavBar user={props.user} logout={props.logout} handleOpen={props.handleOpen} />
    </>
  );
}
