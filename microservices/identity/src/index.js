import mongoose from 'mongoose';
import dotenv from 'dotenv';
import App from './app.js';
import views from './views.js';

dotenv.config();

const app = App.create({
  mongoose
});

await app.start({
  views: views
});

export default app;
