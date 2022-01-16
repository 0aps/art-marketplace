import mongoose from 'mongoose';
import Schemas from './schemas.js';

class CertificateModel {
    toClient () {
        return {
            id: this._id,
            artName: this.artName,
            artDescription: this.artDescription,
            artCreationDate: this.artCreationDate,
            categoryName: this.categoryName,
            username: this.username,
            createdAt: this.createdAt
      };
    }
}

export const Certificate = mongoose.model('Certificate', Schemas.Certificate.loadClass(CertificateModel));
