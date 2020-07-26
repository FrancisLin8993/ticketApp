/**
 * Express app for auth service
 */
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './utils/errors/not-found-error';

const app = express();

//Set trust proxy to true to make sure the Express app knows
//that it is behind the ingress Nginx and still trust traffic as
//being secure.
app.set('trust proxy', true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    //If running in the test environment, the following config should be false in order to correctly set the cookie in the response.
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
