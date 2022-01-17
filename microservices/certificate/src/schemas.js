import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Certificate: new Schema({
    artName: { type: SchemaTypes.String, required: true },
    artDescription: { type: SchemaTypes.String, required: true },
    artCreationDate: { type: SchemaTypes.Number, required: true },
    categoryName: { type: SchemaTypes.String, required: true },
    username: { type: SchemaTypes.String, required: true },
    certificatePath: SchemaTypes.String,
    createdAt: SchemaTypes.Date
  })
};
