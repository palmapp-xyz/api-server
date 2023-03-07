// writing router of sendbird Controller

// importing express router
import {Router} from 'express';
// importing sendbird controller
import {
  refreshSessionToken,
  revokeAllSessionTokens,
} from './sendbirdController';
// importing auth middleware
import {isAuthenticated} from '../middlewares/authHandler';

// generate router instance for sendbird routes and export it to use in index.ts
export const sendbirdRouter = Router();
// refresh session token
sendbirdRouter.get('/refresh', isAuthenticated, refreshSessionToken);
// revoke all session tokens
sendbirdRouter.get('/revoke', isAuthenticated, revokeAllSessionTokens);

