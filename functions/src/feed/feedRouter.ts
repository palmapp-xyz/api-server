import express from 'express';
import {getFeed, getFriendFeed, getFriendsFeed} from './feedController';
import {isAuthenticated} from '../middlewares/authHandler';
// initializing feedRouter
const feedRouter = express.Router();

// a route to fetch feed of login user
feedRouter.get('/get', isAuthenticated, getFeed);
// a route to fetch feed of login user's given friend
feedRouter.get('/get/:friendId', isAuthenticated, getFriendFeed);
// a route to fetch feed of login user's friends
feedRouter.get('/get/friends', isAuthenticated, getFriendsFeed);

export default feedRouter;

// Path: functions/src/feed/feedController.ts
