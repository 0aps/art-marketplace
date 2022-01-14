import mongoose from 'mongoose';
import Schemas from './schemas.js';

class CertificateModel {
    toClient () {
        return {
            id: this._id,
            artName: this.artName,
            artID: this.artID,
            certificatePath: this.certificatePath,
            createdAt: this.createdAt
      };
    }
}

export const Certificate = mongoose.model('Certificate', Schemas.Certificate.loadClass(CertificateModel));
