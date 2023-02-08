"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
var express_1 = __importDefault(require("express"));
var profileController_1 = require("./profileController");
var authHandler_1 = require("../middlewares/authHandler");
var utils_1 = require("./utils");
exports.profileRouter = express_1.default.Router();
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
 *    "message": "profile created"
 *  }
 *  @security JWT
 */
// eslint-disable-next-line max-len
exports.profileRouter.route("/create").post(authHandler_1.isAuthenticated, utils_1.isValidProfile, profileController_1.create);
/**
 * PATCH /profile/update
 * @summary Updates a user's profile on Firestore
 * @tags Profile
 * @param {Profile} request.body.required - Profile to be updated
 * @return {object} 200 - Profile object
 * @example response - 200 - profile updated
 * {
 *     "message": "profile updated"
 * }
 * @security JWT
 */
exports.profileRouter.route("/update").patch(authHandler_1.isAuthenticated, profileController_1.update);
/**
 * GET /profile/get/:id
 * @summary Gets a user's profile on Firestore
 * @tags Profile
 * @param {string} id.params.required - User ID to get profile
 * @return {Profile} 200 - Profile object
 * @example response - 200 - profile retrieved
 * {
 *  "nft_image_url": 'https://example.com/image.png',
 *  "nft_contract_addr": '0x1234567890abcdef1234567890abcdef12345678',
 *  "nft_tokenId": '123',
 *  "bio": 'This is user's bio',
 *  "user_name": 'nickname'
 *  ...
 *
 *  }
 */
exports.profileRouter.route("/get/:id").get(profileController_1.get);
/**
 * GET /profile/sendbird_token
 * @summary Gets a user's profile on Firestore
 * @tags Profile
 * @return {string} 200 - sendbird token
 * @example response - 200 - sendbird token
 * {
 *  "sendbird_token": 'abcdef123451234567890abcdef1234567890abcdef12345678'
 *
 *  }
 *  @security JWT
 */
exports.profileRouter.route("/sendbird_token").get(authHandler_1.isAuthenticated, profileController_1.getSendbirdToken);
/**
 * DELETE /profile/delete
 * @summary Deletes a user's profile on Firestore
 * @tags Profile
 * @return {object} 200 - success object
 * @example response - 200 - profile deleted
 * {
 *    "message": "profile deleted"
 * }
 * @security JWT
 */
exports.profileRouter.route("/delete").delete(authHandler_1.isAuthenticated, profileController_1.del);
