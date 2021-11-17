import mongoose from 'mongoose';
import Schemas from './schemas.js';

class ArtworkModel {
}

export const Artwork = mongoose.model('Artwork', Schemas.Artwork.loadClass(ArtworkModel));
