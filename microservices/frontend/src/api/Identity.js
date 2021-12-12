import Base from './Base';

class IdentityAPI extends Base {
  constructor (params) {
    super(params);
    this.base = 'users';
  }

  login (payload) {
    return this.apiClient.post(`${this.base}/login`, payload);
  }

  logout () {
    return this.apiClient.post(`${this.base}/logout`);
  }

  signup (payload) {
    return this.apiClient.post(this.base, payload);
  }

  forgetPassword (email) {
    return this.apiClient.post(`${this.base}/forgetPassword`, { email });
  }

  restorePassword (key, payload) {
    return this.apiClient.patch(`${this.base}/restorePassword/${key}`, payload);
  }

  me () {
    return this.apiClient.get(`${this.base}/me`);
  }
}

export default IdentityAPI;
