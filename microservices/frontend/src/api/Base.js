export default class Base {
  constructor ({ apiClient }) {
    if (!apiClient) throw new Error('[apiClient] required');
    this.apiClient = apiClient;
    this.base = '';
  }

  create (payload) {
    return this.apiClient.post(this.base, payload);
  }

  update (id, user) {
    const url = [this.base, '/', id].join('');
    return this.apiClient.patch(url, user);
  }

  delete (id) {
    const url = [this.base, '/', id].join('');
    return this.apiClient.delete(url);
  }

  list () {
    return this.apiClient.get(this.base);
  }
}
