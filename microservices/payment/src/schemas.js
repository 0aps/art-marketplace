import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Payment: new Schema({
    name: SchemaTypes.String
  })
};
