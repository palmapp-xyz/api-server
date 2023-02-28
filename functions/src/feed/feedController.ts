import {NextFunction, Request, Response} from 'express';

import {firestore} from '../index';

// writing a controller function to fetch feed of a user's friends using their public keys from firestore
// eslint-disable-next-line complexity
export const getFriendsFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validating request body
    const {limit, offset, address} = req.query;
    // parse limit and offset to integer
    const limitInt = parseInt(limit as string, 10);
    const offsetInt = parseInt(offset as string, 10);

    // fetching friends public keys from firestore
    const friends = await firestore
        .collection('friends')
        .doc(address as string)
        .get();
    // check if login user has any friends
    if (!friends.get('accepted').length && friends.get('accepted').length === 0) {
      // sending error response to client if login user has no friends
      throw new Error('no friends');
    }

    // fetching taker feed of friends from firestore
    const feedByTaker = await firestore
        .collection('/moralis/events/InAppTrades')
        .where('taker', 'in', friends.get('accepted'))
        .offset(offsetInt)
        .limit(limitInt)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // fetching maker feed of friends from firestore
    const feedByMaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('maker', 'in', friends.get('accepted'))
        .offset(offsetInt)
        .limit(limitInt)
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
    // request query params
    const {limit, offset, address} = req.query;
    // request params
    const {friendId} = req.params;
    // parse limit and offset to number
    const limit_n = parseInt(limit as string, 10);
    const offset_n = parseInt(offset as string, 10);
    // check if given friendId is valid friend of login user
    const friends = await firestore
        .collection('friends')
        .doc(address as string)
        .get();
    if (!friends.get('accepted').includes(friendId)) {
      throw new Error('invalid friendId');
    }
    // fetching taker feed of friends from firestore
    const feedByTaker = await firestore
        .collection('/moralis/events/InAppTrades')
        .where('taker', '==', friendId)
        .offset(offset_n)
        .limit(limit_n)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // fetching maker feed of friends from firestore
    const feedByMaker = await firestore
        .collection('moralis/events/InAppTrades')
        .where('maker', '==', friendId)
        .offset(offset_n)
        .limit(limit_n)
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
    const {limit, offset, address} = req.query;
    // parse limit and offset to number
    const limit_n = parseInt(limit as unknown as string, 10);
    const offset_n = parseInt(offset as unknown as string, 10);
    // fetching feed of user from firestore based on maker or taker is login user
    const feedByMaker = await firestore
        .collection('/moralis/events/InAppTrades')
        .where('maker', '==', address)
        .offset(offset_n)
        .limit(limit_n)
        .orderBy('blockTimestamp', 'desc')
        .get();
    const feedByTaker = await firestore
        .collection('InAppTrades')
        .where('taker', '==', address)
        .offset(offset_n)
        .limit(limit_n)
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
    const {limit, offset, address} = req.query;
    const {collectionAddr} = req.params;
    // parse limit and offset to integer
    const limit_n = parseInt(limit as unknown as string, 10);
    const offset_n = parseInt(offset as unknown as string, 10);
    // fetching taker feed of friends from firestore
    const feedByTaker = await firestore
        .collection('/moralis/events/InAppTrades')
        .where('taker', '==', address)
        .where('erc721Token', '==', collectionAddr)
        .offset(offset_n)
        .limit(limit_n)
        .orderBy('blockTimestamp', 'desc')
        .get();
    // fetching maker feed of friends from firestore
    const feedByMaker = await firestore
        .collection('/moralis/events/InAppTrades')
        .where('maker', '==', address)
        .where('erc721Token', '==', collectionAddr)
        .offset(offset_n)
        .limit(limit_n)
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
