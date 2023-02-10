import {NextFunction, Request, Response} from 'express';
import {firestore} from '../index';
import {generateId, Offer, OfferAccepted} from './utils';

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
 * @description - get all buy offers of an nft based on nftContractAddr & nftId & seller
 * @example - get(req, res, next)
 * @throws - profile not found
 *
 * */
export async function getBuyOffersPerNFT(req: Request, res: Response, next: NextFunction) {
  try {
    // get id from req.params
    const {nftContractAddr, nftId, expired} = req.params; // TODO: seller be login user: res.locals.displayName [DONE]
    let result: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
    if(!Boolean(expired)) { // non expired offers only
      // fetch docs from firestore based on nftContractAddr & nftId & seller & expiryTime > now
      result = await firestore.collection('offer').where('nftContractAddr', '==', nftContractAddr).where('nftId', '==', nftId).where('type', '==', 'buy').where('expiryTime', '>', new Date()).get();
    } else { // expired offers only
        // fetch docs from firestore based on nftContractAddr & nftId & seller & expiryTime < now
        result = await firestore.collection('offer').where('nftContractAddr', '==', nftContractAddr).where('nftId', '==', nftId).where('type', '==', 'buy').where('expiryTime', '<', new Date()).get();
    }
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
    // get id from req.params
    const {nftContractAddr, nftId, seller, status} = req.params;
    let result: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
    // fetch docs from firestore based on nftContractAddr & nftId & seller & status
    result = await firestore.collection('offer').where('nftContractAddr', '==', nftContractAddr).where('nftId', '==', nftId).where('seller', '==', seller).where('type', '==', 'sell').where('status', '==', status).get();
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
        // get id from req.params
        const {buyer, status} = req.params;
        let result:  FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
        // fetch docs from firestore if status is accepted based on buyer & status and parse them into Offer[]
        if( status === 'accepted' ) {
           result = await firestore.collection('offer').where('buyer', '==', buyer).where('status', '==', status).where('type', '==', 'buy').get();
        } else {
          // fetch docs from firestore based on buyer and parse them into Offer[]
              result = await firestore.collection('offer').where('buyer', '==', buyer).where('type', '==', 'buy').get();
        }
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
export async function getAllSellOffers(req: Request, res: Response, next: NextFunction) {
    try {
        // get id from req.params
        const {seller, status} = req.params;
        let result:  FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
        // fetch docs from firestore based on seller & status and parse them into Offer[]
        result = await firestore.collection('offer').where('seller', '==', seller).where('status', '==', status).where('type', '==', 'sell').get();
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

// writing a function to accept a buy offer & update the status of the sell offer to accepted plus adding offerAccepted object to the sell offer
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
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
    // update doc from firestore based on nfId & nftContractAddr & logged in user displayName as seller & type & status
    let offerDoc = await firestore.collection('offer')
        .where('nftId', '==', nftId)
        .where('nftContractAddr', '==', nftContractAddr)
        .where('seller', '==', res.locals.displayName)
        .where('type', '==', 'sell')
        .where('status', '==', 'pending').get()
       // update doc status to accepted and add offerAccepted object
    await offerDoc.docs[0].ref.update({
        status: 'accepted',
        offerAccepted.txHash: accepted.txHash
    })

    // if doc not found throw error
    if (!offer.exists) {
      throw new Error('offer not found');
    }
    // update doc status to accepted
    await firestore.collection('offer').doc(id).update({status: 'accepted', offerAccepted});
    // send response
    res.status(200).json({result: 'offer updated'});
  } catch (err) {
    next(err);
  }
}
