import Base from './Base';

class ArtworkAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'artworks';
  }

  list (query) {
    return this.apiClient.get(`${this.base}`, {}, query);
  }
}

export default ArtworkAPI;
