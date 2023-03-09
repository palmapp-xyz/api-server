// writing router of sendbird Controller

// importing express router
import {Router} from 'express';
// importing sendbird controller
import {
  refreshSessionToken,
  revokeAllSessionTokens,
} from './sendbirdController';
// importing auth middleware

// generate router instance for sendbird routes and export it to use in index.ts
export const sendbirdRouter = Router();
// refresh session token
// eslint-disable-next-line no-inline-comments
sendbirdRouter.get('/refresh', /* isAuthenticated,*/ refreshSessionToken);
// revoke all session tokens
// eslint-disable-next-line no-inline-comments
sendbirdRouter.get('/revoke', /* isAuthenticated,*/ revokeAllSessionTokens);

