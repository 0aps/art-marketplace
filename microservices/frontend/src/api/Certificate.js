import Base from './Base';

class CertificateAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'certificates';
  }
  
  create (payload) {
    return this.apiClient.post(this.base, payload);
  }

  get (id) {
    return this.apiClient.get(this.base);
  }

}

export default CertificateAPI;
