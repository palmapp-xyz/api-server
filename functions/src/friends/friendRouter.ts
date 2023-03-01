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
/**
 * @typedef {object} FriendBody - body object for friend APIs calls
 * @property {string} friendId.required - friendId  - eg: 0x1234567890abcdef1234567890abcdef12345678
 *
 */
// get all friends
/**
 * GET /friends/list/:id
 * @summary Gets a user's friends list
 * @tags Friends
 * @param {string} id.query.required - User ID to get friends list
 * @return {object} 200 - Friends list
 * @example response - 200 - friends list retrieved
 * {
 * 'friends': [ '0x1234567890abcdef1234567890abcdef12345678']
 * }
 */
friendRouter.get('/list/:id', getFriends);
// get all friend requests
/**
 * GET /friends/list/requests
 * @summary Gets a user's friend requests, which are pending for user to accept/reject
 * @tags Friends
 * @return {object} 200 - Friend requests list
 * @example response - 200 - friend requests list retrieved
 * {
 * 'requests': [ '0x1234567890abcdef1234567890abcdef12345678']
 * }
 * @security JWT
 */
friendRouter.get('/list/requests', isAuthenticated, getRequests);
// get all friend requests which are pending
/**
 * GET /friends/list/pending
 * @summary Gets a user's friend requests, which are pending for user to accept/reject
 * @tags Friends
 * @return {object} 200 - Friend requests list
 * @example response - 200 - friend requests list retrieved
 * {
 * 'pending': [ '0x1234567890abcdef1234567890abcdef12345678']
 * }
 * @security JWT
 */
friendRouter.get('/list/pending', isAuthenticated, getPendingRequests);
// send friend request
/**
 * POST /friends/request
 * @summary Sends a friend request to another user
 * @tags Friends
 * @param {FriendBody} request.body.required - friendId to send friend request
 * @return {object} 200 - Friend request sent
 * @example response - 200 - friend request sent
 * {
 * 'message': 'friend request sent'
 * }
 * @example param - friendId
 * {
 *  friendId: '0x1234567890abcdef1234567890abcdef12345678'
 *  }
 * @security JWT
 */
friendRouter.post('/request', isAuthenticated, requestFriend);
// accept friend request
/**
 * POST /friends/accept
 * @summary Accepts a friend's request of given user
 * @tags Friends
 * @param {FriendBody} request.body.required - friendId to accept friend request
 * @return {object} 200 - Friend request accepted
 * @example response - 200 - friend request accepted
 * {
 * 'message': 'friend request accepted'
 * }
 * @example param - friendId
 * {
 *   friendId: '0x1234567890abcdef1234567890abcdef12345678'
 * }
 * @security JWT
 */
friendRouter.post('/accept', isAuthenticated, acceptFriend);
// reject friend request
/**
 * POST /friends/reject
 * @summary Rejects a friend's request of given user
 * @tags Friends
 * @param {FriendBody} request.body.required - friendId to reject friend request
 * @return {object} 200 - Friend request rejected
 * @example response - 200 - friend request rejected
 * {
 * 'message': 'friend request rejected'
 * }
 * @example param - friendId
 * {
 *  friendId: '0x1234567890abcdef1234567890abcdef12345678'
 *  }
 * @security JWT
 */
friendRouter.post('/reject', isAuthenticated, rejectFriend);
// unfriend
/**
 * POST /friends/unfriend
 * @summary Unfriends a given user from current user's friend list
 * @tags Friends
 * @param {FriendBody} request.body.required - friendId to unfriend
 * @return {object} 200 - Friend is unfriended
 * @example response - 200 - Friend is unfriended
 * {
 * 'message': 'Friend is unfriended'
 * }
 * @example param - friendId
 * {
 * friendId: '0x1234567890abcdef1234567890abcdef12345678'
 * }
 * @security JWT
 */
friendRouter.post('/unfriend', isAuthenticated, unFriend);

// Path: functions/src/friends/friendController.ts
