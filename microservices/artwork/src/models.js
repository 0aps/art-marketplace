import mongoose from 'mongoose';
import Schemas from './schemas.js';

class ArtworkModel {
  toClient () {
    return {
      id: this._id,
      name: this.name,
      description: this.description,
      user: this.user && this.user.toClient ? this.user.toClient() : this.user,
      state: this.state,
      price: this.price,
      category: this.category && this.category.toClient ? this.category.toClient() : this.category,
      createdAt: this.createdAt,
      pictures: this.pictures
    };
  }
}

class CategoryModel {
  toClient () {
    return {
      id: this._id,
      name: this.name,
      description: this.description
    };
  }
}

class UserModel {
  toClient () {
    return {
      id: this._id,
      username: this.username
    };
  }
}

export const Artwork = mongoose.model('Artwork', Schemas.Artwork.loadClass(ArtworkModel));
export const Category = mongoose.model('Category', Schemas.Category.loadClass(CategoryModel));
export const User = mongoose.model('User', Schemas.User.loadClass(UserModel));
