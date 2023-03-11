import { errorHandler } from './middlewares/error-handler';
import express from 'express';
import { json } from 'body-parser'
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(currentUserRouter);

// all means all method by GET, POST, PUT, PATCH and DELETE will be handled
app.all('*', () => {
  throw new NotFoundError()
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});