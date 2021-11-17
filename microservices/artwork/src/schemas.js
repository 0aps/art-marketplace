import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Artwork: new Schema({
    name: SchemaTypes.String
  })
};
