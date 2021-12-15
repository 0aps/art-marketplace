import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Order:new Schema({
    id_user: {
      type: Number,
      required: "El id usuario es obligatorio",
    },
    items: {
      type: [
        {
          id_artwork: {
            type: Number,
            required: "El id es obligatorio",
          },
          name: {
            type: String,
          },
          precio: {
            type: Number,
            required: "El precio es pbligatorio ",
          },
        },
      ],
      default: [],
    },
  })
};
