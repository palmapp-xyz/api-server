import {Router} from 'express';
import {
  fetchChannel,
  fetchProfile,
  suggestChannelsByName,
  suggestProfilesByHandle, validateChannelSearchFields,
  validateProfileSearchFields,
} from './controller';
export const searchRouter = Router();
/**
 * @typedef {object} SearchQuery
 * @property {string} query.required - query to search for - eg: 'dennis'
 * @property {[string]} searchFields.required - fields to search in - eg: '[handle, name]'
 * @property {number} offset.required - offset to start from - eg: 0
 * @property {number} size.required - number of results to return - eg: 10
 *
 */
/**
 * @typedef {object} SuggestionsQuery
 * @property {string} query.required - query to search for - eg: 'dennis'
 * @property {[string]} searchFields.required - fields to search in - eg: '[handle, name]'
 * @property {number} size.required - number of results to return - eg: 10
 */
/**
 * POST /search/profile/suggestions
 * @summary Get suggestions for profiles by given prefix
 * @tags Search
 *
 * @param {SuggestionsQuery} request.body.required - query to search for
 * @return {object} 200 - An object of suggestions
 * @return {Error}  default - Unexpected error
 *
 */
searchRouter.post('/profile/suggestions', validateProfileSearchFields, suggestProfilesByHandle);

/**
 * POST /search/profile
 * @summary Get profile by given search query
 * @tags Search
 *
 * @param {SearchQuery} request.body.required - query to search for
 * @return {object} 200 - An object of profiles
 * @return {Error}  default - Unexpected error
 *
 */
searchRouter.post('/profile', validateProfileSearchFields, fetchProfile);

/**
 * POST /search/channel/suggestions
 * @summary Get suggestions for channels by given query prefix
 * @tags Search
 *
 * @param {SuggestionsQuery} request.body.required - query to search for
 * @return {object} 200 - An object of suggestions
 * @return {Error}  default - Unexpected error
 *
 */
searchRouter.post('/channel/suggestions', validateChannelSearchFields, suggestChannelsByName);

/**
 * POST /search/channel
 * @summary Get channels by given search query
 * @tags Search
 *
 * @param {SearchQuery} request.body.required - query to search for
 * @return {object} 200 - An object of channels
 * @return {Error}  default - Unexpected error
 *
 */
searchRouter.post('/channel', validateChannelSearchFields, fetchChannel);
