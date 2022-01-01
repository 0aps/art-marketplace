import Base from './Base';

class ArtworkAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'artworks';
  }
}

export default ArtworkAPI;
