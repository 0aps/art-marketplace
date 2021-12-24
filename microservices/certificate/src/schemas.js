import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

export default {
  Certificate: new Schema({
    artName: {
      type: SchemaTypes.String,
      required: [true, 'Artwork name required'],
      unique: true
    },
    artID: {
      type: SchemaTypes.String,
      required: [true, 'Artwork ID required'],
      unique: true
    },
    certificatePath: {
      type: SchemaTypes.String,
      required: [true, 'Certificate path required'],
      unique: true
    },
    creationDate: SchemaTypes.Date
  })
};
