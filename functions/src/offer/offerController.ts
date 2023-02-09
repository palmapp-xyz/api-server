import {NextFunction, Request, Response} from 'express';
import {firestore} from '../index';
import {generateId, Offer} from './utils';

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
      const result = await firestore.collection('offer').where('nftContractAddr', '==', offer.nftContractAddr).where('nftId', '==', offer.nftId).where('type', '==', 'sell').where('status', '==', 'pending').where('seller', '==', offer.seller).get();
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
      const result = await firestore.collection('offer').where('buyer', '==', offer.buyer).where('seller', '==', offer.seller).where('nftContractAddr', '==', offer.nftContractAddr).where('nftId', '==', offer.nftId).where('type', '==', 'buy').where('status', '==', 'pending').get();
      // check if doc exists throw error offer already exists
      if (!result.empty) {
        throw new Error('offer already exists');
      }
      // create a new offer in firestore
      await firestore.collection('offer').doc(generateId()).set({
        ...offer,
      });
    }
    // create a new offer in firestore
    await firestore.collection('offer').doc(generateId()).set({
      ...offer,
    });

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
 * @description - get all offers of an nft based on nftContractAddr & nftId & seller
 * @example - get(req, res, next)
 * @throws - profile not found
 *
 * */
export async function getAllOffers(req: Request, res: Response, next: NextFunction) {
  try {
    // get id from req.params
    const {nftContractAddr, nftId, seller} = req.params;
    // fetch docs from firestore based on nftContractAddr & nftId & seller and parse them into Offer[]
    const result = await firestore.collection('offer').where('nftContractAddr', '==', nftContractAddr).where('nftId', '==', nftId).where('seller', '==', seller).where('type', '==', 'buy').get();
    // remove id from each doc and parse them into Offer[]
    const offers = result.docs.map((doc) => {
      const {id, ...data} = doc.data();
      return data;
    });
    // send response
    res.status(200).json({result: offers});
  } catch (err) {
    next(err);
  }
}
