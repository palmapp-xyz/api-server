import express from 'express';
import {
  create, update, get, del, getSendbirdToken,
} from './profileController';
import {isAuthenticated} from '../middlewares/authHandler';
import {isValidProfile} from './utils';
import {createSendbirdUser} from '../sendbird/sendbirdController';


export const profileRouter = express.Router();

// eslint-disable-next-line max-len
// nft_image_url, nft_contract_addr, nft_tokenId, bio, user_name, sendbird_token
/**
 * @typedef {object} Profile
 * @property {string} nft_image_url - NFT's image URL to be displayed on profile
 * @property {string} nft_contract_addr - user's NFT contract address
 * @property {string} nft_tokenId - user's NFT token ID on given contract
 * @property {string} bio - user's bio
 * @property {string} user_name - user's name
 * @property {string} sendbird_token - user's sendbird token
 * ...
 */
/**
 * POST /profile/create
 * @summary Creates a new user's profile on Firestore
 * @tags Profile
 * @param {Profile} request.body.required - Profile to be created
 * @return {object} 200 - Profile object
 * @example response - 200 - profile created
 * {
 *    'message': 'profile created'
 *  }
 *  @security JWT
 */
// eslint-disable-next-line max-len
profileRouter.route('/create').post(isAuthenticated, isValidProfile, createSendbirdUser, create);
/**
 * PUT /profile/update
 * @summary Updates a user's profile on Firestore
 * @tags Profile
 * @param {Profile} request.body.required - Profile to be updated
 * @return {object} 200 - Profile object
 * @example response - 200 - profile updated
 * {
 *     'message': 'profile updated'
 * }
 * @security JWT
 */
profileRouter.route('/update').put(isAuthenticated, update);
/**
 * GET /profile/get/:id
 * @summary Gets a user's profile on Firestore
 * @tags Profile
 * @param {string} id.params.required - User ID to get profile
 * @return {Profile} 200 - Profile object
 * @example response - 200 - profile retrieved
 * {
 *  'nft_image_url': 'https://example.com/image.png',
 *  'nft_contract_addr': '0x1234567890abcdef1234567890abcdef12345678',
 *  'nft_tokenId': '123',
 *  'bio': 'This is user's bio',
 *  'user_name': 'nickname'
 *  ...
 *
 *  }
 */
profileRouter.route('/get/:id').get(get);

/**
 * GET /profile/sendbird_token
 * @summary Gets a user's profile on Firestore
 * @tags Profile
 * @return {string} 200 - sendbird token
 * @example response - 200 - sendbird token
 * {
 *  'sendbird_token': 'abcdef123451234567890abcdef1234567890abcdef12345678'
 *
 *  }
 *  @security JWT
 */
profileRouter.route('/sendbird_token').get(isAuthenticated, getSendbirdToken);
/**
 * DELETE /profile/delete
 * @summary Deletes a user's profile on Firestore
 * @tags Profile
 * @return {object} 200 - success object
 * @example response - 200 - profile deleted
 * {
 *    'message': 'profile deleted'
 * }
 * @security JWT
 */
profileRouter.route('/delete').delete(isAuthenticated, del);
