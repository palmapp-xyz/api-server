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
// eslint-disable-next-line no-inline-comments
/**
 * GET /sendbird/token/refresh
 * @description - refresh sendbird's session token
 * @tags Sendbird
 * @return {object} 200 - sendbird's session token
 * @example response - 200 - session token refreshed
 * {
 *  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsic2VuZGJpcmQiXSwiaWF0IjoxNjIyNjQxNjQyLCJleHAiOjE'
 *  expires_at: 1622641642
 *  }
 *  @security JWT
 *
 */
sendbirdRouter.get('/refresh', isAuthenticated, refreshSessionToken);
// revoke all session tokens
/**
 * GET /sendbird/token/revoke
 * @description - revoke all sendbird's session tokens of logged in user
 * @tags Sendbird
 * @return {object} 200 - sendbird's session token
 * @example response - 200 - session token revoked
 * {
 * message: 'session token revoked'
 * }
 * @security JWT
 */
sendbirdRouter.get('/revoke', isAuthenticated, revokeAllSessionTokens);

