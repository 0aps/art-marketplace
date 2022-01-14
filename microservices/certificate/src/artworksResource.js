import urljoin from 'url-join';
import request from 'request-promise-native';

class ArtworksResource {
  static artworksUrl (resourceUrl) {
    const artworkServer = (process.env.ARTWORKS_URL || 'http://localhost:3000/api/v1');
    return urljoin(artworkServer, resourceUrl);
  }

  static requestHeaders () {
    return {
      json: true
    };
  }

  static getArtworkById (artworkId) {
    const url = ArtworksResource.artworksUrl('/artworks/' + artworkId);
    const options = {
      headers: ArtworksResource.requestHeaders()
    };

    return request.get(url, options);
  }
}

export default ArtworksResource;
