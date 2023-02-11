import {Router} from 'express';
import {create, accept, reject, cancel, getSellOffersPerNFT, getSellOffers, getBuyOffersPerNFT, getAllBuyOffers} from './offerController';
import {isValidOffer} from './utils';
import {isAuthenticated} from '../middlewares/authHandler';

// generate router instance for offer routes and export it to use in app.ts and index.ts
export const offerRouter = Router();
// create a new offer
offerRouter.post('/create', isAuthenticated, isValidOffer, create);
// accept an offer
offerRouter.post('/accept', isAuthenticated, accept);
// reject an offer
offerRouter.post('/reject', isAuthenticated, reject);
// cancel an offer
offerRouter.post('/cancel', isAuthenticated, cancel);
// get all sell offers
offerRouter.get('/sell/all', getSellOffers);
// get all buy offers
offerRouter.get('/buy/all', getAllBuyOffers);
// get all sell offers per nft
offerRouter.get('/sell/:nftId', getSellOffersPerNFT);
// get all buy offers per nft
offerRouter.get('/buy/:nftId', getBuyOffersPerNFT);

