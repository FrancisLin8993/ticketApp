/**
 * The route of getting the current user.
 */
import express from 'express';
import { currentUserHandler } from '../middlewares/current-user-handler';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.get('/api/users/currentuser', currentUserHandler, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
