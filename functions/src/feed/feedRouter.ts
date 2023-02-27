import express from 'express';
import {getFeed, getFriendFeed, getFriendsFeed, getCollectionFeed} from './feedController';
import {isAuthenticated} from '../middlewares/authHandler';
import {validateCollectionAddr, validateFriendId, validatePagination} from './utils';
// initializing feedRouter
const feedRouter = express.Router();

// a route to fetch feed of login user
feedRouter.get('/get', isAuthenticated, validatePagination, getFeed);
// a route to fetch feed of login user's given friend
feedRouter.get('/get/:friendId', isAuthenticated, validatePagination, validateFriendId, getFriendFeed);
// a route to fetch feed of login user's friends
feedRouter.get('/get/friends', isAuthenticated, validatePagination, getFriendsFeed);
// a route to fetch feed of login user's given collection
feedRouter.get('/get/collection/:collectionAddr', isAuthenticated, validatePagination, validateCollectionAddr, getCollectionFeed);

export default feedRouter;

// Path: functions/src/feed/feedController.ts
