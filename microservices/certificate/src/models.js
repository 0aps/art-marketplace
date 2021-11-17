import mongoose from 'mongoose';
import Schemas from './schemas.js';

class CertificateModel {
}

export const Certificate = mongoose.model('Certificate', Schemas.Certificate.loadClass(CertificateModel));
