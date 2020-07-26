/**
 * The route of user sign up.
 */
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../utils/errors/bad-request-error';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    //Validate email and password using express-validator
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    //If the existing user exist, return corresponding error
    if (existingUser) {
      throw new BadRequestError('Email already used');
    }

    const user = User.build({ email, password });
    //Persist the user object into DB
    await user.save();

    //Generate a JWT for user
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      //use non-null assertion on the jwt key environment variable
      process.env.JWT_KEY!
    );

    //Store the JWT on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
