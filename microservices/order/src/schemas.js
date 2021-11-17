import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Order: new Schema({
    name: SchemaTypes.String
  })
};
