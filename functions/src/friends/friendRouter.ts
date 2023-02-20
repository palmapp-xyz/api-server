import {Router} from 'express';
import {
  getFriends,
  getRequests,
  requestFriend,
  acceptFriend,
  unFriend,
  rejectFriend,
  getPendingRequests,
} from './friendController';
import {isAuthenticated} from '../middlewares/authHandler';

// generate router instance for friend routes and export it to use in app.ts and index.ts
export const friendRouter = Router();
// get all friends
friendRouter.get('/:id', getFriends);
// get all friend requests
friendRouter.get('/requests', isAuthenticated, getRequests);
// get all friend requests which are pending
friendRouter.get('/pending', isAuthenticated, getPendingRequests);
// send friend request
friendRouter.post('/request', isAuthenticated, requestFriend);
// accept friend request
friendRouter.post('/accept', isAuthenticated, acceptFriend);
// reject friend request
friendRouter.post('/reject', isAuthenticated, rejectFriend);
// unfriend
friendRouter.post('/unfriend', isAuthenticated, unFriend);

// Path: functions/src/friends/friendController.ts
