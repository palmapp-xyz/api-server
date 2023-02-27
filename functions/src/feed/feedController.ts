import {NextFunction, Request, Response} from 'express';

// we are using express-validator to validate the request body
import {body, validationResult} from 'express-validator';
import {firestore} from '../index';

// writing a controller function to fetch feed of a user's friends using their public keys from firestore
// eslint-disable-next-line complexity
export const getFriendsFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validating request body
    const {limit, offset} = req.params as unknown as {limit: number; offset: number};
    // fetching friends public keys from firestore
    const friends = await firestore.collection('friends').doc(res.locals.displayName).get();
    // check if login user has any friends
    if (!friends.get('accepted').length && friends.get('accepted').length === 0) {
      // sending error response to client if login user has no friends
      throw new Error('no friends');
    }

    // fetching taker feed of friends from firestore
    const feedByTaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('taker', 'in', friends.get('accepted'))
        .offset(offset)
        .limit(limit)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // fetching maker feed of friends from firestore
    const feedByMaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('maker', 'in', friends.get('accepted'))
        .offset(offset)
        .limit(limit)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // check if both feeds are non empty
    if (!feedByTaker.docs.length && !feedByMaker.docs.length) {
      // merging both feeds and sorting them by blockTimestamp in descending order
      const feed = feedByTaker.docs
          .concat(feedByMaker.docs)
          .sort((a, b) => b.data().blockTimestamp - a.data().blockTimestamp);

      // sending feed to client
      res.status(200).json({feed: feed.map((doc) => doc.data())});
    } else {
      // check if both feeds are empty
      if (!feedByTaker.docs.length && !feedByMaker.docs.length) {
        // sending error response to client if both feeds are empty
        throw new Error('no feed');
      } else {
        // check if taker feed is empty and maker feed is non-empty then send maker feed to client, vice versa
        res.status(200).json({
          feed: feedByTaker.docs.length ? feedByTaker.docs.map((doc) => doc.data()) : feedByMaker.docs.map((doc) => doc.data()),
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// writing a controller to fetch feed of login user's given friend using their public key from firestore
export const getFriendFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // request params
    const {limit, offset, friendId} = req.params as unknown as {limit: number; offset: number, friendId: string};
    // check if given friendId is valid friend of login user
    const friends = await firestore.collection('friends').doc(res.locals.displayName).get();
    if (!friends.get('accepted').includes(friendId)) {
      throw new Error('invalid friendId');
    }
    // fetching taker feed of friends from firestore
    const feedByTaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('taker', '==', friendId)
        .offset(offset)
        .limit(limit)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // fetching maker feed of friends from firestore
    const feedByMaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('maker', '==', friendId)
        .offset(offset)
        .limit(limit)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // check if both feeds are non empty
    if (!feedByTaker.docs.length && !feedByMaker.docs.length) {
      // merging both feeds and sorting them by blockTimestamp in descending order
      const feed = feedByTaker.docs
          .concat(feedByMaker.docs)
          .sort((a, b) => b.data().blockTimestamp - a.data().blockTimestamp);
        // sending feed to client
      res.status(200).json({feed: feed.map((doc) => doc.data())});
    } else {
      // check if both feeds are empty
      if (!feedByTaker.docs.length && !feedByMaker.docs.length) {
        // sending error response to client if both feeds are empty
        throw new Error('no feed');
      } else {
        // check if taker feed is empty and maker feed is non-empty then send maker feed to client, vice versa
        res.status(200).json({
          feed: feedByTaker.docs.length ? feedByTaker.docs.map((doc) => doc.data()) : feedByMaker.docs.map((doc) => doc.data()),
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// writing a controller to fetch feed of login user
export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // request params for pagination
    const {limit, offset} = req.params as unknown as {limit: number; offset: number};

    // fetching feed of user from firestore based on maker or taker is login user
    const feedByMaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('maker', '==', res.locals.displayName)
        .offset(offset)
        .limit(limit)
        .orderBy('blockTimestamp', 'desc')
        .get();
    const feedByTaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('maker', '==', res.locals.displayName)
        .offset(offset)
        .limit(limit)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // checking if both feeds are not empty
    if (!feedByMaker.empty && !feedByTaker.empty) {
      // merging both feeds and sorting them by blockTimestamp
      const feed = feedByMaker.docs.concat(feedByTaker.docs).sort((a, b) => {
        return b.data().blockTimestamp - a.data().blockTimestamp;
      });
      // sending feed to client
      res.status(200).json({feed: feed.map((doc) => doc.data())});
    } else {
      // return if both feeds are empty
      if (feedByMaker.empty && feedByTaker.empty) {
        res.status(200).json({feed: []});
        return;
      }
      // return feed by maker if feed by taker is empty and vice versa
      res.status(200).json({feed: feedByMaker.empty ? feedByTaker.docs.map((doc) => doc.data()) : feedByMaker.docs.map((doc) => doc.data())});
    }
  } catch (error) {
    next(error);
  }
};

// get feed per collection of user
// TODO: get feed per collection of friend
// TODO: get feed per collection of friends
// TODO: sort feed by block number or block timestamp. (blockTimestamp is better) (done)
// TODO: get public feed of user

// writing a controller to fetch feed of login user's given collection
export const getCollectionFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // request body
    const {limit, offset, collectionAddr} = req.params as unknown as {limit: number; offset: number, collectionAddr: string};
    // fetching taker feed of friends from firestore
    const feedByTaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('taker', '==', res.locals.displayName)
        .where('erc721Token', '==', collectionAddr)
        .offset(offset)
        .limit(limit)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // fetching maker feed of friends from firestore
    const feedByMaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('maker', '==', res.locals.displayName)
        .where('erc721Token', '==', collectionAddr)
        .offset(offset)
        .limit(limit)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // check if both feeds are non empty
    if (!feedByTaker.docs.length && !feedByMaker.docs.length) {
      // merging both feeds and sorting them by blockTimestamp in descending order
      const feed = feedByTaker.docs
          .concat(feedByMaker.docs)
          .sort((a, b) => b.data().blockTimestamp - a.data().blockTimestamp);
      // sending feed to client
      res.status(200).json({feed: feed.map((doc) => doc.data())});
    } else {
      // check if both feeds are empty
      if (!feedByTaker.docs.length && !feedByMaker.docs.length) {
        // sending error response to client if both feeds are empty
        throw new Error('no feed');
      } else {
        // check if taker feed is empty and maker feed is non-empty then send maker feed to client, vice versa
        res.status(200).json({
          feed: feedByTaker.docs.length ? feedByTaker.docs.map((doc) => doc.data()) : feedByMaker.docs.map((doc) => doc.data()),
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

