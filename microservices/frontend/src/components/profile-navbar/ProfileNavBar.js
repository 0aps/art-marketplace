import { ProfileModal } from '../profile-modal/ProfileModal';
import { NavBar } from '../navbar/NavBar';

export function ProfileNavBar (props) {
  return (
    <>
      <ProfileModal user={props.user} parentCallBack={props.parentCallBack} setParentCallBack={props.setParentCallBack}/>
      <NavBar user={props.user} logout={props.logout} onTrigger={props.onTrigger}/>
    </>
  );
}
