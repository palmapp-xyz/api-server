import {NextFunction, Request, Response} from 'express';
import {firestore} from '../index';
import {generateId, Offer, OfferAccepted} from './utils';
import FirebaseFirestore from '@google-cloud/firestore';

/**
 * Create a new offer
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - create offer
 * @example - create(req, res, next)
 * */
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const offer = req.body as Offer;
    // check if offer type is buy
    if (offer.type === 'sell') {
      // fetching doc from firestore based on nftContractAddr & nftId & type is sell & status is pending
      const result = await firestore
          .collection('offer')
          .where('nftContractAddr', '==', offer.nftContractAddr)
          .where('nftId', '==', offer.nftId)
          .where('type', '==', 'sell')
          .where('status', '==', 'pending')
          .where('seller', '==', offer.seller)
          .get();
      // check if doc exists throw error offer already exists
      if (!result.empty) {
        throw new Error('offer already exists');
      }
      // create a new offer in firestore
      await firestore.collection('offer').doc(generateId()).set({
        ...offer,

      });
    } else {
      // fetching doc from firestore based on buyer, seller & nftContractAddr & nftId & type is buy & status is pendiing
      const result = await firestore
          .collection('offer')
          .where('buyer', '==', offer.buyer)
          .where('seller', '==', offer.seller)
          .where('nftContractAddr', '==', offer.nftContractAddr)
          .where('nftId', '==', offer.nftId)
          .where('type', '==', 'buy')
          .where('status', '==', 'pending')
          .get();
      // check if doc exists throw error offer already exists
      if (!result.empty) {
        throw new Error('offer already exists');
      }
      // create a new offer in firestore
      await firestore.collection('offer').doc(generateId()).set({
        ...offer,
      });
    }

    // send response
    res.status(200).json({message: 'offer created'});
  } catch (err) {
    next(err);
  }
}

/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - get all buy offers of an nft based on nftContractAddr & nftId & seller
 * @example - get(req, res, next)
 * @throws - profile not found
 *
 * */
export async function getBuyOffersPerNFT(req: Request, res: Response, next: NextFunction) {
  try {
    // get id from req.query
    const {nftContractAddr, nftId, status} = req.query;
    // non expired offers only
    // fetch docs from firestore based on nftContractAddr & nftId & seller & expiryTime > now
    const result = await firestore
        .collection('offer')
        .where('nftContractAddr', '==', nftContractAddr)
        .where('nftId', '==', nftId)
        .where('type', '==', 'buy')
        .where('status', '>', status)
        .get();
    const offers = result.docs.map((doc) => {
      const {id} = doc;
      return {id, ...doc.data()};
    });
    // send response
    res.status(200).json({result: offers});
  } catch (err) {
    next(err);
  }
}

// writing a function to fetch sell offer of given nft
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - get sell offers of an nft based on nftContractAddr & nftId & seller
 * @example - get(req, res, next)
 * @throws - offers not found
 *
 */
export async function getSellOffersPerNFT(req: Request, res: Response, next: NextFunction) {
  try {
    // get id from req.query
    const {nftContractAddr, nftId, seller, status} = req.query;
    // fetch docs from firestore based on nftContractAddr & nftId & seller & status
    const result = await firestore
        .collection('offer')
        .where('nftContractAddr', '==', nftContractAddr)
        .where('nftId', '==', nftId)
        .where('seller', '==', seller)
        .where('type', '==', 'sell')
        .where('status', '==', status)
        .get();
    const offers = result.docs.map((doc) => {
      const {id} = doc;
      return {id, ...doc.data()};
    });
    // send response
    res.status(200).json({result: offers});
  } catch (err) {
    next(err);
  }
}

// writing a function to get all buy offers of a user based on buyer address and status
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - get all buy offers of a user based on buyer address and status
 * @example - get(req, res, next)
 * @throws - offers not found
 *
 */
export async function getAllBuyOffers(req: Request, res: Response, next: NextFunction) {
  try {
    // get id from req.query
    const {buyer, status} = req.query;
    let result: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
    // fetch docs from firestore if status is accepted based on buyer & status and parse them into Offer[]
    if (status === 'accepted') {
      result = await firestore
          .collection('offer')
          .where('buyer', '==', buyer)
          .where('status', '==', status)
          .where('type', '==', 'buy')
          .get();
    } else {
      // fetch docs from firestore based on buyer and parse them into Offer[]
      result = await firestore.collection('offer')
          .where('buyer', '==', buyer)
          .where('type', '==', 'buy')
          .get();
    }
    const offers = result.docs.map((doc) => {
      const {id} = doc;
      return {id, ...doc.data()};
    });
    // send response
    res.status(200).json({result: offers});
  } catch (err) {
    next(err);
  }
}

// writing a function to get all sell offers of a user based on seller address and status
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - get all sell offers of a user based on seller address and status
 * @example - get(req, res, next)
 * @throws - offers not found
 *
 */
export async function getSellOffers(req: Request, res: Response, next: NextFunction) {
  try {
    // get id from req.query
    const {seller, status} = req.query;
    // fetch docs from firestore based on seller & status and parse them into Offer[]
    const result = await firestore
        .collection('offer')
        .where('seller', '==', seller)
        .where('status', '==', status)
        .where('type', '==', 'sell')
        .get();
    // remove id from each doc and parse them into Offer[]
    const offers = result.docs.map((doc) => {
      const {id} = doc;
      return {id, ...doc.data()};
    });
    // send response
    res.status(200).json({result: offers});
  } catch (err) {
    next(err);
  }
}

// writing a function to accept a buy offer & update the status of the sell offer to accepted plus adding offerAccepted object to the sell offer
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @check - nftId, nftContractAddr, offerAccepted should be present in req.body
 * @check - offerAccepted should be of type OfferAccepted
 * @check - given offerId should exists in firestore & not expired
 * @check - given offerId should be of type buy
 * @check - given offerId should be of status pending
 * @check - given seller should have matching Sell Offer
 * @return {void}
 * @description - accept a buy offer & update the status of the sell offer to accepted plus adding offerAccepted object to the sell offer
 * @example - accept(req, res, next)
 * @throws - offer not found
 * @throws - offer not updated
 */
export async function accept(req: Request, res: Response, next: NextFunction) {
  try {
    // get nftId, nftContractAddr, seller from req.body
    const {nftId, nftContractAddr, offerAccepted} = req.body;
    // get offerAccepted from req.body
    const accepted = offerAccepted as OfferAccepted;
    // given offerId should exists in firestore & not expired
    const buyOffer = await firestore.collection('offer').doc(accepted.offerId).get();
    if (!buyOffer.exists && buyOffer.data()?.expiryTime >= Date.now()) {
      throw new Error('given buy offer does not exists or expired');
    }
    // update doc from firestore based on nfId & nftContractAddr & logged in user displayName as seller & type & status
    const offerDoc = await firestore.collection('offer')
        .where('nftId', '==', nftId)
        .where('nftContractAddr', '==', nftContractAddr)
        .where('seller', '==', res.locals.displayName)
        .where('type', '==', 'sell')
        .where('status', '==', 'pending').get();

    // if doc not found throw error
    // eslint-disable-next-line no-inline-comments
    if (offerDoc.docs.length !== 1) { // TODO: can there be more than one?
      throw new Error('sell offer not found');
    }
    // update doc status to accepted and add offerAccepted object
    await offerDoc.docs[0].ref.update({
      status: 'accepted',
      // eslint-disable-next-line no-inline-comments
      offerAccepted: accepted, // TODO: test-case should be added to check if this works
    });
    // update all buy offers of given nftId & nftContractAddr & seller to expired except given offerId
    await firestore.collection('offer')
        .where('nftId', '==', nftId)
        .where('nftContractAddr', '==', nftContractAddr)
        .where('seller', '==', res.locals.displayName)
        .where('type', '==', 'buy')
        .where('status', '==', 'pending')
        .where('id', '!=', accepted.offerId).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.update({status: 'expired'});
          });
        });
    // send response
    res.status(200).json({result: 'offer accepted'});
  } catch (err) {
    next(err);
  }
}

// writing a function to reject a buy offer by seller of given nftId & nftContractAddr
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - reject a buy offer by seller of given nftId & nftContractAddr
 * @example - reject(req, res, next)
 * @throws - offer not found
 *
 */
export async function reject(req: Request, res: Response, next: NextFunction) {
  try {
    // get nftId, nftContractAddr, seller from req.body
    const {nftId, nftContractAddr, offerId} = req.body;
    // given offerId should exists in firestore
    const buyOffer = await firestore.collection('offer').doc(offerId).get();
    // buyOffer should exists & nftId, nftContractAddr, seller should match
    if (!buyOffer.exists &&
        buyOffer.data()?.nftId === nftId &&
        buyOffer.data()?.nftContractAddr === nftContractAddr &&
        buyOffer.data()?.seller === res.locals.displayName) {
      throw new Error('given buy offer does not exists or valid');
    }
    // checking if offer is already accepted or rejected
    if (buyOffer.data()?.status === 'accepted' || buyOffer.data()?.status === 'rejected') {
      throw new Error('given buy offer is already accepted or rejected');
    }
    // update doc status to rejected of given offerId
    await firestore.collection('offer').doc(offerId).update({
      status: 'rejected',
    });
    // send response
    res.status(200).json({result: 'buy offer rejected'});
  } catch (err) {
    next(err);
  }
}

// write a generic function to cancel any offer by seller or buyer of given nftId & nftContractAddr
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - cancel any offer by seller or buyer of given nftId & nftContractAddr
 * @example - cancel(req, res, next)
 * @throws - offer not found
 *
 */
export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    // get nftId, nftContractAddr, seller from req.body
    const {offerId} = req.body;
    // given offerId should exists in firestore
    const offer = await firestore
        .collection('offer')
        .where('offerId', '==', offerId)
        .get();
    // offer should exists
    if (!offer.empty) {
      throw new Error('given offerId does not exists');
    }
    // check if offer is buy offer
    if (offer.docs[0].data()?.type === 'buy') {
      // check if offer is not by buyer
      if (offer.docs[0].data()?.buyer !== res.locals.displayName) {
        throw new Error('given offerId does not belongs to you');
      }
      await offer.docs[0].ref.update({
        status: 'cancelled',
      });
      // send response
      res.status(200).json({result: 'buy offer cancelled'});
    } else {
      // check if offer is not by seller
      if (offer.docs[0].data()?.seller !== res.locals.displayName) {
        throw new Error('given offerId does not belongs to you');
      }
      await offer.docs[0].ref.update({
        status: 'cancelled',
      });
      // send response
      res.status(200).json({result: 'sell offer cancelled'});
    }
  } catch (err) {
    next(err);
  }
}
