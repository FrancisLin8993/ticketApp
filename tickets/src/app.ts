/**
 * Express app for auth service
 */
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';

import { errorHandler, NotFoundError } from '@francislinticketapp/common';

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

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
