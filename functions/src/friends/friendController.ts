import {Request, Response, NextFunction} from 'express';
import {firestore} from '../index';

export const getFriends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const friends = await firestore.collection('friends').doc(id).get();
    res.status(200).json({friends: friends.get('accepted') ?? []});
  } catch (error) {
    next(error);
  }
};
export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const friends = await firestore.collection('friends').doc(res.locals.displayName).get();
    res.status(200).json({requests: friends.get('requests') ?? []});
  } catch (error) {
    next(error);
  }
};
export const getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const friends = await firestore.collection('friends').doc(res.locals.displayName).get();
    res.status(200).json({pending: friends.get('pending') ?? []});
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line complexity
export const requestFriend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // send friend request to given user
    const {friendId} = req.body;
    const requester = await firestore
        .collection('friends')
        .doc(res.locals.displayName)
        .get();
    if (requester.get('accepted') && requester.get('accepted').includes(friendId)) {
      res.status(400).json({message: 'Already friends'});
      return;
    }
    // check if friend request already exists
    const requested = await firestore
        .collection('friends')
        .doc(friendId)
        .get();
    if (requested.get('requests') && requested.get('requests').includes(res.locals.displayName)) {
      res.status(400).json({message: 'Friend request already sent'});
      return;
    }
    if (requested.get('pending') && requested.get('pending').includes(res.locals.displayName)) {
      res.status(400).json({message: 'you\'re already requested by this user'});
      return;
    }
    // add friend request to user
    if (!requested.get('requests') || requested.get('requests').length === 0) {
      await firestore.collection('friends').doc(friendId).set({
        requests: [res.locals.displayName],
      });
    } else {
      // insert friend request to friendId's requests list
      requested.get('requests').push(res.locals.displayName);
      await firestore.collection('friends').doc(friendId).update({
        requests: requested.get('requests'),
      });
    }
    // add friend request to friendId's pending requests
    if (!requester.get('pending') || requester.get('pending').length === 0) {
      await firestore.collection('friends').doc(res.locals.displayName).set({
        pending: [friendId],
      });
    } else {
      requester.get('pending').push(friendId);
      await firestore.collection('friends').doc(res.locals.displayName).update({
        pending: requester.get('pending'),
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
    const accepter = await firestore
        .collection('friends')
        .doc(res.locals.displayName)
        .get();
    if (!accepter.exists || !accepter.get('requests').includes(friendId)) {
      res.status(400).json({message: 'No friend request found'});
      return;
    }
    // delete friend request
    await firestore.collection('friends').doc(res.locals.displayName).update({
      requests: accepter.get('requests').filter((request: string) => request !== friendId),
    });
    // delete pending request from friendId
    const requester = await firestore.collection('friends').doc(friendId).get();
    // eslint-disable-next-line no-inline-comments
    if (requester.exists) { // this should always be true
      await firestore.collection('friends').doc(friendId).update({
        pending: requester.get('pending').filter((request: string) => request !== res.locals.displayName),
      });
    }
    // add friend to accepter's accepted list
    if (!accepter.get('accepted')) {
      await firestore.collection('friends').doc(res.locals.displayName).set({
        accepted: [friendId],
      });
    } else {
      accepter.get('accepted').push(friendId);
      await firestore.collection('friends').doc(res.locals.displayName).update({
        accepted: accepter.get('accepted'),
      });
    }
    // add friend to requester's accepted list
    if (!requester.get('accepted')) {
      await firestore.collection('friends').doc(friendId).set({
        accepted: [res.locals.displayName],
      });
    } else {
      requester.get('accepted').push(res.locals.displayName);
      await firestore.collection('friends').doc(friendId).update({
        accepted: accepter.get('accepted'),
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
    const rejecter = await firestore
        .collection('friends')
        .doc(res.locals.displayName)
        .get();
    if (!rejecter.exists || !rejecter.get('requests').includes(friendId)) {
      res.status(400).json({message: 'No friend request found'});
      return;
    }
    // delete friend request
    await firestore.collection('friends').doc(res.locals.displayName).update({
      requests: rejecter.get('requests').filter((request: string) => request !== friendId),
    });
    // delete pending request from friendId
    const requester = await firestore.collection('friends').doc(friendId).get();
    if (requester.exists) {
      await firestore.collection('friends').doc(friendId).update({
        pending: requester.get('pending').filter((request: string) => request !== res.locals.displayName),
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
    const friend1 = await firestore.collection('friends').doc(res.locals.displayName).get();
    const friend2 = await firestore.collection('friends').doc(friendId).get();
    if (friend1.get('accepted') &&
        friend1.get('accepted').includes(friendId) &&
        friend2.get('accepted') &&
        friend2.get('accepted').includes(res.locals.displayName)) {
      await firestore.collection('friends').doc(res.locals.displayName).update({
        accepted: friend1.get('accepted').filter((f: string) => f !== friendId),
      });
      await firestore.collection('friends').doc(friendId).update({
        accepted: friend2.get('accepted').filter((f: string) => f !== res.locals.displayName),
      });
    } else {
      res.status(400).json({message: 'No friend found'});
      return;
    }
    res.status(200).json({message: 'Friend is unfriended'});
  } catch (error) {
    next(error);
  }
};
