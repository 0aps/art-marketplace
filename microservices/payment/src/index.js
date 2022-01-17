import dotenv from 'dotenv';
import mongoose from 'mongoose';
import App from './app.js';
import views from './views.js';
import subscriptions from "./subscriptions.js";

dotenv.config();

const app = App.create({
  mongoose
});

await app.start({
  views: views,
  subscriptions: subscriptions,
});

export default app;
