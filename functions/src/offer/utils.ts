import {NextFunction, Request, Response} from 'express';
import web3 from 'web3';
// generate type with name Offer using properties mentioned above
export type Offer = {
    txHash: string;
    nftId: number;
    nftContractAddr: string;
    price: Price;
    expiryTime: number;
    seller: string;
    buyer: string;
    status: OfferStatus;
    type: OfferType;
    sendbirdMessageId: string;
}
// generating enum with name OfferStatus using properties 'pending', 'accepted', 'rejected'
export enum OfferStatus {
    pending = 'pending',
    accepted = 'accepted',
    rejected = 'rejected',
}
// generating enum with name OfferType using properties 'buy', 'sell'
export enum OfferType {
    buy = 'buy',
    sell = 'sell',
}
// generating type with name Price using properties amount & symbol
export type Price = {
    amount: number;
    symbol: string;
}
/**
    * @param {Request} req - Express request object
    * @param {Response} res - Express response object
    * @param {Function} next - Express next middleware function
    * @return {void}
    * @description - validate body of profile creation request
    * @example - validateBody(req, res, next)
    * @throws - invalid body, minimum 6 keys are required
    * @throws - nft_image_url is required
    * @throws - nft_contract_addr is required
    * @throws - nft_tokenId is required
    * @throws - bio is required
    * @throws - user_name is required
    * @throws - sendbird_token is required
    * @throws - invalid token
* */
// eslint-disable-next-line complexity
export async function isValidOffer(req: Request, res: Response, next: NextFunction) {
  try {
    // get body from req object and parse it to Offer type
    const {txHash, nftId, nftContractAddr, price, expiryTime, seller, buyer, type} = req.body as Offer;
    // validating txHash is valid web3 txHash using regex
    if (!txHash || !txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
      throw new Error('invalid txHash');
    }
    // validating nftId is valid number
    if (!nftId || isNaN(nftId)) {
      throw new Error('invalid nftId');
    }
    // validating nftContractAddr is valid web3 address using web3 util isAddress
    if (!nftContractAddr || !web3.utils.isAddress(nftContractAddr)) {
      throw new Error('invalid nftContractAddr');
    }
    // validating price is valid object with amount & symbol properties and amount is valid number and symbol is valid string of atleast 2 characters
    if (!price || !price.amount || isNaN(price.amount) || !price.symbol || typeof price.symbol !== 'string' || price.symbol.length < 2) {
      throw new Error('invalid price');
    }
    // validating expiryTime is valid timestamp in seconds and is not in past
    if (!expiryTime || isNaN(expiryTime) || expiryTime < Date.now() / 1000) {
      throw new Error('invalid expiryTime');
    }
    // validating seller is valid web3 address using web3 util isAddress
    if (!seller || !web3.utils.isAddress(seller)) {
      throw new Error('invalid seller');
    }
    // validating buyer is valid web3 address using web3 util isAddress
    if (!buyer || !web3.utils.isAddress(buyer)) {
      throw new Error('invalid buyer');
    }
    // add status to req object with default value pending
    req.body.status = OfferStatus.pending;
    // validating type is valid OfferType enum
    if (!type || !Object.values(OfferType).includes(type)) {
      throw new Error('invalid type');
    }
    // call next middleware
    next();
  } catch (err) {
    next(err);
  }
}
// TODO: need to check if login user is seller then seller must be login user & if login user is buyer then buyer must be login user
// TODO: need to check if seller has already escrowed the NFT or not
// TODO: need to check if buyer has already escrowed the price or not
// TODO: if offer is sell then buyer must null
// TODO: buy offer should not have status accepted or rejected, they are considered accepted only when seller refer them in sell offer
// TODO: sell type of offer must have buy offer's reference which got accepted by seller
// function to generate random id for firestore document
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
