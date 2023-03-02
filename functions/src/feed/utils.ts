// feed routes validators
import {check} from 'express-validator';

// validate pagination parameters
export const validatePagination = [
  check('limit', 'invalid limit').isInt({min: 1, max: 100}),
  check('offset', 'invalid offset').isInt({min: 0})];

// validate chainId parameter
export const validateChainId = [check('chainId', 'invalid chainId').isInt({min: 1})];

// validate friendId parameter using web3
export const validateFriendId = [check('friendId', 'invalid friendId').isEthereumAddress()];
// validate collection id parameter using web3
export const validateCollectionAddr = [check('collectionAddr', 'invalid collectionAddr').isEthereumAddress()];
