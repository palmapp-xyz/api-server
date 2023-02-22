import {NextFunction, Request, Response} from 'express';

// we are using express-validator to validate the request body
import {body, validationResult} from 'express-validator';
import {firestore} from '../index';

// writing a controller function to fetch feed of a user's friends using their public keys from firestore
export const getFriendsFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validating request body
    const {limit, offset} = req.body;
    // fetching friends public keys from firestore
    const friends = await firestore.collection('friends').doc(res.locals.displayName).get();
    // fetching feed of friends from firestore
    const feed = await firestore
        .collection('moralis/events/InAppTrades')
        .where('name', 'in', friends.get('accepted'))
        .offset(offset)
        .limit(limit)
        .get();
    // sending feed to client
    res.status(200).json({feed: feed.docs.map((doc) => doc.data())});
  } catch (error) {
    next(error);
  }
};

// writing a controller to fetch feed of login user's given friend using their public key from firestore
export const getFriendFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // request body
    const {limit, offset} = req.body;
    const {friendId} = req.params;
    // check if given friendId is valid friend of login user
    const friends = await firestore.collection('friends').doc(res.locals.displayName).get();
    if (!friends.get('accepted').includes(friendId)) {
      throw new Error('invalid friendId');
    }
    // fetching feed of friends from firestore
    const feed = await firestore
        .collection('moralis/events/InAppTrades')
        .where('name', '==', friendId)
        .offset(offset)
        .limit(limit)
        .get();
    // sending feed to client
    res.status(200).json({feed: feed.docs.map((doc) => doc.data())});
  } catch (error) {
    next(error);
  }
};

// writing a controller to fetch feed of login user
export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // request body
    const {limit, offset} = req.body;
    // fetching feed of friends from firestore
    const feed = await firestore
        .collection('moralis/events/InAppTrades')
        .where('name', '==', res.locals.displayName)
        .offset(offset)
        .limit(limit)
        .get();
    // sending feed to client
    res.status(200).json({feed: feed.docs.map((doc) => doc.data())});
  } catch (error) {
    next(error);
  }
};
