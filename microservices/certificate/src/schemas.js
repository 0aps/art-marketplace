import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Certificate: new Schema({
    name: SchemaTypes.String
  })
};
