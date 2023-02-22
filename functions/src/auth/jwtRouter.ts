import express from 'express';
import {idTokenGenertor} from './jwtController';

export const jwtRouter = express.Router();
/**
 * @typedef {object} JwtIssueToken
 * @property {string} networkType - The network type e.g 'evm'
 * @property {string} message - The message that is signed by the user
 * @property {string} signature - The signature of the message
 */
/**
 * POST /jwt/issue
 * @summary Issue a jwt/id token for the user after verifying the signature, BaseURL: https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1
 * @tags Auth
 * @param {JwtIssueToken} request.body.required - The request body object containing the data object with the networkType, message and signature
 * @returns {object} 200 - The response object containing the auth token(JWT token)
 * @return {object} 200 - The response object containing the auth token(JWT token)
 * @example response - 200 - The response object containing the auth token(JWT token)
 * {
 *    'result': {
 *           'idToken': 'bXl0b2tlbg==23e4r23SDFasfdg'
 *    }
 * }
 * @example request - The request body object
 * {
 *    'networkType': 'evm',
 *    'message': 'oedi-a1953.web.app wants you to sign in with your Ethereum account:\n0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0\n\nTo authenticate please sign this message.\n\nURI: https://oedi-a1953.web.app/\nVersion: 1\nChain ID: 1\nNonce: Cwt6fznrxgHvIXdvv\nIssued At: 2023-02-05T12:53:06.907Z\nExpiration Time: 2023-02-05T13:08:06.641Z\nNot Before: 2023-02-05T12:53:06.641Z',
 *    'signature': '0xEfd3eFEfd3eFEfd3eF1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0eFEfd3eF1Efd3eFd7c78d9d3eFEfd3eF1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0eFEfd3eF1Efd3eFd7c78d9'
 *    }
 */
jwtRouter.post('/issue', idTokenGenertor);
