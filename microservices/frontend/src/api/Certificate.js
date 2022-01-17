import Base from './Base';

class CertificateAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'certificates';
  }
}

export default CertificateAPI;
