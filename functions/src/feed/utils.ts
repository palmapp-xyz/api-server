// feed routes validators
import {check} from 'express-validator';

// validate pagination parameters
export const validatePagination = [check('limit').isInt({min: 1, max: 100}), check('offset').isInt({min: 0})];

// validate friendId parameter using web3
export const validateFriendId = [check('friendId').isEthereumAddress()];
// validate collection id parameter using web3
export const validateCollectionAddr = [check('collectionAddr').isEthereumAddress()];
