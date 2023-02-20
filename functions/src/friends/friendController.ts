import {Request, Response, NextFunction} from 'express';
import {firestore} from '../index';

export const getFriends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const friends = await firestore.collection('friends').doc(id).get();
    res.status(200).json(friends.data()?.accepted);
  } catch (error) {
    next(error);
  }
};
export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const friends = await firestore.collection('friends').doc(res.locals.displayName).get();
    res.status(200).json(friends.data()?.requests);
  } catch (error) {
    next(error);
  }
};
export const getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const friends = await firestore.collection('friends').doc(res.locals.displayName).get();
    res.status(200).json(friends.data()?.pending);
  } catch (error) {
    next(error);
  }
};

export const requestFriend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // send friend request to given user
    const {friendId} = req.body;
    const accepted = await firestore
        .collection('friends')
        .where('id', '==', res.locals.displayName)
        .where('accepted', 'array-contains', friendId)
        .get();
    if (!accepted.empty) {
      res.status(400).json({message: 'Already friends'});
      return;
    }
    // check if friend request already exists
    const requested = await firestore
        .collection('friends')
        .where('id', '==', friendId)
        .where('requests', 'array-contains', res.locals.displayName)
        .get();
    if (!requested.empty) {
      res.status(400).json({message: 'Friend request already sent'});
      return;
    }
    // add friend request to user
    const friend = await firestore.collection('friends').doc(friendId).get();
    if (!friend.exists) {
      await firestore.collection('friends').doc(friendId).set({
        requests: [res.locals.displayName],
      });
    }
    await firestore.collection('friends').doc(friendId).update({
      // eslint-disable-next-line no-unsafe-optional-chaining
      requests: [...friend.data()?.requests, res.locals.displayName],
    });
    // add friend request to friendId's pending requests
    const requester = await firestore.collection('friends').doc(res.locals.displayName).get();
    if (requester.exists) {
      await firestore.collection('friends').doc(friendId).update({
        // eslint-disable-next-line no-unsafe-optional-chaining
        requests: [...requester.data()?.pending, friendId],
      });
    }

    res.status(200).json({message: 'Friend request sent'});
  } catch (error) {
    next(error);
  }
};
export const acceptFriend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {friendId} = req.body;
    const requested = await firestore
        .collection('friends')
        .where('id', '==', res.locals.displayName)
        .where('requests', 'array-contains', friendId)
        .get();
    if (requested.empty) {
      res.status(400).json({message: 'No friend request found'});
      return;
    }
    // delete friend request
    await firestore.collection('friends').doc(res.locals.displayName).update({
      requests: requested.docs[0].data().requests.filter((request: string) => request !== friendId),
    });
    // delete pending request from friendId
    const requester = await firestore.collection('friends').doc(friendId).get();
    if (requester.exists) {
      await firestore.collection('friends').doc(friendId).update({
        // eslint-disable-next-line no-unsafe-optional-chaining
        pending: requester.data()?.pending.filter((request: string) => request !== res.locals.displayName),
      });
    }
    // add friend to user accepted list
    const friend = await firestore.collection('friends').doc(res.locals.displayName).get();
    if (!friend.exists) {
      await firestore.collection('friends').doc(res.locals.displayName).set({
        accepted: [friendId],
      });
    } else {
      await firestore.collection('friends').doc(res.locals.displayName).update({
        // eslint-disable-next-line no-unsafe-optional-chaining
        accepted: [...friend.data()?.accepted, friendId],
      });
    }

    res.status(200).json({message: 'Friend request accepted'});
  } catch (error) {
    next(error);
  }
};
export const rejectFriend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {friendId} = req.body;
    const requested = await firestore
        .collection('friends')
        .where('id', '==', res.locals.displayName)
        .where('requests', 'array-contains', friendId)
        .get();
    if (requested.empty) {
      res.status(400).json({message: 'No friend request found'});
      return;
    }
    // delete friend request
    await firestore.collection('friends').doc(res.locals.displayName).update({
      requests: requested.docs[0].data().requests.filter((request: string) => request !== friendId),
    });
    // delete pending request from friendId
    const requester = await firestore.collection('friends').doc(friendId).get();
    if (requester.exists) {
      await firestore.collection('friends').doc(friendId).update({
        // eslint-disable-next-line no-unsafe-optional-chaining
        pending: requester.data()?.pending.filter((request: string) => request !== res.locals.displayName),
      });
    }
    // need to delete friend request from sender's pending array as well
    const friend = await firestore.collection('friends').doc(friendId).get();
    if (friend.exists) {
      await firestore.collection('friends').doc(friendId).update({
        requests: friend.data()?.pending.filter((p: string) => p !== res.locals.displayName),
      });
    }


    res.status(200).json({message: 'Friend request rejected'});
  } catch (error) {
    next(error);
  }
};

export const unFriend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {friendId} = req.body;
    const friend = await firestore.collection('friends').doc(res.locals.displayName).get();
    if (friend.exists) {
      await firestore.collection('friends').doc(res.locals.displayName).update({
        friends: friend.data()?.friends.filter((f: string) => f !== friendId),
      });
    } else {
      res.status(400).json({message: 'No friend found'});
      return;
    }
    res.status(200).json({message: 'Friend deleted'});
  } catch (error) {
    next(error);
  }
};
