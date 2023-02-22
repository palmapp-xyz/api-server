import express from 'express';
import {getFeed, getFriendFeed, getFriendsFeed} from './feedController';
import {isAuthenticated} from "../middlewares/authHandler";
// initializing feedRouter
const feedRouter = express.Router();

// a route to fetch feed of login user
feedRouter.get('/feed', isAuthenticated, getFeed);
// a route to fetch feed of login user's given friend
feedRouter.get('/feed/:friendId', isAuthenticated, getFriendFeed);
// a route to fetch feed of login user's friends
feedRouter.get('/friends/feed', isAuthenticated, getFriendsFeed);

export default feedRouter;

// Path: functions/src/feed/feedController.ts
