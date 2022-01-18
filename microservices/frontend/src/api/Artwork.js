import Base from './Base';

class ArtworkAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'artworks';
  }

  getCategories (query) {
    return this.apiClient.get(`${this.base}/category`, {}, query);
  }
}

export default ArtworkAPI;
