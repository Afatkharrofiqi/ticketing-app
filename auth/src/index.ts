import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser'
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
// use this because we need https and behind the ingress nginx proxy
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  name: 'ticketing-session',
  signed: false,
  secure: true
}));

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(currentUserRouter);

// all means all method by GET, POST, PUT, PATCH and DELETE will be handled
app.all('*', async () => {
  throw new NotFoundError()
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

start();
