import express from 'express';
import {getFeed, getFriendFeed, getFriendsFeed, getCollectionFeed} from './feedController';
import {validateCollectionAddr, validateFriendId, validatePagination} from './utils';
// initializing feedRouter
const feedRouter = express.Router();

// a route to fetch feed of login user
/**
 * GET /feed/
 * @tags feed
 * @summary fetch feed of given user
 * @param {string} address.query.required - address of user
 * @param {integer} limit.query.required - limit of feed
 * @param {integer} offset.query.required - offset of feed
 * @return {object} 200 - feed of given user
 * @return {Error}  default - Unexpected error
 * @example response - 200 - success response example
 * {
 *   feed: [
 *     {
 *       blockHash: '0x032d3ecffcbd4f22a1ba54dcc9145041f527734e5cd1e76da0a517772d843107',
 *       erc721Token: '0x9c25ee0f938122a504be82189536df74687858e4',
 *       updatedAt: [Object],
 *       transactionHash: '0xc179b2f3827d2714734d8261e167d94187427480ba1477b36f525e6525bedaf1',
 *       erc20Token: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
 *       maker: '0xaa22df74d79f49e26fac5c880a3d9eca54d08648',
 *       id: '0x6c420b7c3173cd620ae18a57d4d079f3c108e117de061211c632e2d4157db2e2',
 *       direction: '0',
 *       address: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
 *       confirmed: true,
 *       erc721TokenId: '77371319470920077708254739',
 *       taker: '0x30df4f0070043af74613229125dc663e76d9d9d2',
 *       logIndex: 714,
 *       nonce: '100131415900000000000000000000000000000071464997875189782120215745431714834594',
 *       matcher: '0x0000000000000000000000000000000000000000',
 *       blockTimestamp: 1677530419,
 *       name: 'ERC721OrderFilled',
 *       blockNumber: 39780656,
 *       erc20TokenAmount: '12825000000000000000',
 *       chainId: 137
 *     },
 *     ...
 *     ]
 *     }
 *
 */
feedRouter.get('/', /* isAuthenticated,*/ validatePagination, getFeed);
// a route to fetch feed of login user's given friend
/**
 * GET /feed/friends/:friendId
 * @tags feed
 * @summary fetch feed of given user's given friend
 * @param {string} friendId.path.required - address of friend
 * @param {integer} limit.query.required - limit of feed
 * @param {integer} offset.query.required - offset of feed
 * @param {string} address.query.required - address of user
 * @return {object} 200 - feed of given user's given friend
 * @return {Error}  default - Unexpected error
 * @example response - 200 - success response example
 * {
 *  feed: [
 * {
 *       taker: '0x87cf728b8074fd109ba33098e64570c6c1a61390',
 *       transactionHash: '0x07194083c981e1c461261d7534f8adcd059010227f40829dc24f8ae3eb29167d',
 *       erc20Token: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
 *       maker: '0x858bbd8667054ac550c591cc66bc31063b707703',
 *       blockHash: '0x5fc46dd0dec22f26d1aabca1abc3f97da359e3561cf6e72d3de69ea3d615232c',
 *       erc721Token: '0x9c25ee0f938122a504be82189536df74687858e4',
 *       chainId: 137,
 *       logIndex: 222,
 *       erc20TokenAmount: '1615000000000000000',
 *       direction: '0',
 *       address: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
 *       name: 'ERC721OrderFilled',
 *       nonce: '100131415900000000000000000000000000000218631150111254332832351480776457342137',
 *       id: '0x7b835cb703790702054f9889f244721d2206fb9b9955c65065d7373843a2de4f',
 *       blockTimestamp: 1677489649,
 *       confirmed: true,
 *       updatedAt: [Object],
 *       blockNumber: 39762789,
 *       matcher: '0x0000000000000000000000000000000000000000',
 *       erc721TokenId: '38687268890190974298163313'
 *     },
 *     ...
 *     ]
 *     }
 */
feedRouter.get('/friends/:friendId', /* isAuthenticated,*/ validatePagination, validateFriendId, getFriendFeed);
// a route to fetch feed of login user's friends
/**
 * GET /feed/friends
 * @tags feed
 * @summary fetch feed of given user's friends
 * @param {integer} limit.query.required - limit of feed
 * @param {integer} offset.query.required - offset of feed
 * @param {string} address.query.required - address of user
 * @return {object} 200 - feed of given user's friends
 * @return {Error}  default - Unexpected error
 * @example response - 200 - success response example
 * {
 * feed: [
 * {
 *       erc20Token: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
 *       updatedAt: [Object],
 *       blockNumber: 39761187,
 *       direction: '0',
 *       maker: '0xaa22df74d79f49e26fac5c880a3d9eca54d08648',
 *       erc721TokenId: '38686257197817636309975963',
 *       erc721Token: '0x9c25ee0f938122a504be82189536df74687858e4',
 *       transactionHash: '0x487a9cfb9ffd4ee6a0a66deec4fed1d3a7e966c7906bf53c8dd0f5f48560eef5',
 *       chainId: 137,
 *       taker: '0x87cf728b8074fd109ba33098e64570c6c1a61390',
 *       erc20TokenAmount: '1520000000000000000',
 *       confirmed: true,
 *       blockTimestamp: 1677485805,
 *       nonce: '100131415900000000000000000000000000000139683862476386496006467577950349809971',
 *       matcher: '0x0000000000000000000000000000000000000000',
 *       blockHash: '0x6431b41df8955e4a69011f9321caf1df6ac13b414562bd2749992632fbe263bb',
 *       id: '0x1bd2b2298b2103c29724dcc9cc0fbd8c5cb915fcd06d4180d33b51ab6cc071f8',
 *       logIndex: 390,
 *       address: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
 *       name: 'ERC721OrderFilled'
 *     },
 *     ...
 *   ]
 * }
 */
feedRouter.get('/friends', /* isAuthenticated,*/ validatePagination, getFriendsFeed);
// a route to fetch feed of login user's given collection
/**
 * GET /feed/collection/:collectionAddr
 * @tags feed
 * @summary fetch feed of given user's given collection
 * @param {string} collectionAddr.path.required - address of collection
 * @param {integer} limit.query.required - limit of feed
 * @param {integer} offset.query.required - offset of feed
 * @param {string} address.query.required - address of user
 * @return {object} 200 - feed of given user's given collection
 * @return {Error}  default - Unexpected error
 * @example response - 200 - success response example
 * {
 * feed: [
 * {
 *       direction: '0',
 *       nonce: '100131415900000000000000000000000000000076370409692095570805615319452171330666',
 *       erc721TokenId: '19343824058070276585771906',
 *       erc20Token: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
 *       address: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
 *       logIndex: 204,
 *       id: '0x80f667bde5695f4090bfa4f559f6b51eb24821eddade865974e825de83361d6b',
 *       blockNumber: 39757482,
 *       updatedAt: [Object],
 *       taker: '0x0000000000000000000000000000000000000000',
 *       blockTimestamp: 1677477003,
 *       maker: '0xaa22df74d79f49e26fac5c880a3d9eca54d08648',
 *       erc721TokenProperties: '',
 *       confirmed: true,
 *       erc721Token: '0x9c25ee0f938122a504be82189536df74687858e4',
 *       chainId: 137,
 *       blockHash: '0x065f15f2573096b2b19fd45d932f1d7e3ab1072985bf6188831e7ddba65c41d4',
 *       expiry: '2524604400',
 *       fees: '0x58A24Fa9AE8847CBCf245Dd2eF7FceF205927af1,5000000000000000,0x',
 *       name: 'ERC721OrderPreSigned',
 *       transactionHash: '0xc7a5aab2c4fa7788f1b80329cbe415ce56e3a2e74af396a3a45c12ac0bf020d3',
 *       erc20TokenAmount: '95000000000000000'
 *     },
 *     ...
 *   ]
 * }
 */
feedRouter.get('/collection/:collectionAddr', /* isAuthenticated,*/ validatePagination, validateCollectionAddr, getCollectionFeed);

export default feedRouter;

// Path: functions/src/feed/feedController.ts
