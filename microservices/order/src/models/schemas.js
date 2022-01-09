import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  User: new Schema({
    username: SchemaTypes.String,
    email: SchemaTypes.String
  }),
  Cart: new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: mongoose.Schema.Types.Mixed }],
    state: {
      type: SchemaTypes.String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  }),
  Order: new Schema({
    id_user: {
      type: SchemaTypes.Number,
      required: 'El id usuario es obligatorio'
    },
    items: {
      type: [
        {
          id_artwork: {
            type: SchemaTypes.Number,
            required: 'El id es obligatorio'
          },
          name: {
            type: SchemaTypes.String
          },
          precio: {
            type: SchemaTypes.Number,
            required: 'El precio es pbligatorio '
          }
        }
      ]
    }
  })
};
