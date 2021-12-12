import ApiClient from './ApiClient';
import IdentityAPI from './Identity';
import ArtworkAPi from './Artwork';

const ApiSingleton = () => {
  const api = new ApiClient();

  return {
    identity: new IdentityAPI({ apiClient: api }),
    artwork: new ArtworkAPi({ apiClient: api })
  };
};

export default ApiSingleton();
