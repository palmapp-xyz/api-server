/**
 * @typedef {object} AuthRequestMessage
 * @property {object} data
 * @property {string} networkType - The network type e.g 'evm'
 * @property {string} address - The address of the user
 * @property {string} chain - The chain of the network e.g '0x1' for Ethereum Mainnet
 *
 */
/**
* POST /ext-moralis-auth-requestMessage
 * @summary Request a message to be signed by the user. BaseURL: https://asia-northeast3-oedi-a1953.cloudfunctions.net
 * @tags Auth
 * @param {AuthRequestMessage} request.body.required - The request body object containing the data object with the networkType, address and chain
 * @returns {object} 200 - The response object containing the message needs to be signed by the user
 * @example request - The request object
 * {
 *    "data": {
 *    "networkType": "evm",
 *    "address": "0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0",
 *    "chain": "0x1"
 *    }
 *    }
 * @example response - 200 - The response object containing the message needs to be signed by the user
 * {
 *     "result": {
 *         "id": "ZJN2CfqMldUWgezVH",
 *         "message": "oedi-a1953.web.app wants you to sign in with your Ethereum account:\n0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0\n\nTo authenticate please sign this message.\n\nURI: https://oedi-a1953.web.app/\nVersion: 1\nChain ID: 1\nNonce: Cwt6fznrxgHvIXdvv\nIssued At: 2023-02-05T12:53:06.907Z\nExpiration Time: 2023-02-05T13:08:06.641Z\nNot Before: 2023-02-05T12:53:06.641Z",
 *         "profileId": "0xad339ed840cb8c4e8f33a6fd07672c53f1c35ed197ba49f1536b43e27cb8b4a8"
 *     }
 * }
* */
/**
 * @typedef {object} AuthIssueToken
 * @property {object} data
 * @property {string} networkType - The network type e.g 'evm'
 * @property {string} message - The message that is signed by the user
 * @property {string} signature - The signature of the message
 */
/**
 * POST /ext-moralis-auth-issueToken
 * @summary Issue a token for the user after verifying the signature, BaseURL: https://asia-northeast3-oedi-a1953.cloudfunctions.net
 * @tags Auth
 * @param {AuthIssueToken} request.body.required - The request body object containing the data object with the networkType, message and signature
 * @returns {object} 200 - The response object containing the auth token(custom token)
 * @return {object} 200 - The response object containing the auth token(custom token)
 * @example response - 200 - The response object containing the auth token(custom token)
 * {
 *    "result": {
 *           "token": "bXl0b2tlbg==23e4r23SDFasfdg"
 *    }
 * }
 * @example request - The request body object
 * {
 *   "data": {
 *    "networkType": "evm",
 *    "message": "oedi-a1953.web.app wants you to sign in with your Ethereum account:\n0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0\n\nTo authenticate please sign this message.\n\nURI: https://oedi-a1953.web.app/\nVersion: 1\nChain ID: 1\nNonce: Cwt6fznrxgHvIXdvv\nIssued At: 2023-02-05T12:53:06.907Z\nExpiration Time: 2023-02-05T13:08:06.641Z\nNot Before: 2023-02-05T12:53:06.641Z",
 *    "signature": "0xEfd3eFEfd3eFEfd3eF1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0eFEfd3eF1Efd3eFd7c78d9d3eFEfd3eF1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0eFEfd3eF1Efd3eFd7c78d9"
 *    }
 *    }
 */
declare const _default: null;
export default _default;
