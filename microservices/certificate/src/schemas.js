import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Certificate: new Schema({
    artName: SchemaTypes.String,
    artID: SchemaTypes.String,
    certificatePath: SchemaTypes.String,
    creationDate: SchemaTypes.Date
  })
};
