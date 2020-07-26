/**
 * Entry point of the authentication service
 */
import mongoose from 'mongoose';

import { app } from './app';

/**
 * A function connecting to mongodb
 * The connection string domain name will be the k8s cluster IP service name
 */
const connectDb = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined.');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongodb');
  } catch (error) {
    console.error(error);
  }
};

/**
 * Listen on the port
 */
app.listen(3000, () => {
  console.log('listening on port 3000!');
});

connectDb();
