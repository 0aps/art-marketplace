import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  User: new Schema({
    name: SchemaTypes.String
  })
};
