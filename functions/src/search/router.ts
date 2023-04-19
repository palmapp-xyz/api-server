import {Router} from 'express';
import {
  searchChannels,
  searchProfiles,
  searchAll, suggestAll, suggestChannels, suggestProfiles,
} from './controller';
export const searchRouter = Router();
/**
 * @typedef {object} SearchQuery
 * @property {string} query.required - query to search for - eg: 'dennis'
 * @property {[string]} searchFields.required - fields to search in - eg: '[handle, name]'
 * @property {number} page.required - offset in terms of pages - eg: 1 (first page, which means offset = pageSize * (page - 1))
 * @property {number} pageSize.required - number of results to return - eg: 10
 *
 */

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
searchRouter.post('/profile', searchProfiles);

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
searchRouter.post('/channel', searchChannels);
/**
 * POST /search/all
 * @summary Get channels & profiles by given search query (both)
 * @tags Search
 *
 * @param {SearchQuery} request.body.required - query to search for
 * @return {object} 200 - An object of channels
 * @return {Error}  default - Unexpected error
 *
 */
searchRouter.post('/all', searchAll);

/**
 * @typedef {object} SuggestQuery
 * @property {string} query.required - query to search for - eg: 'vic'
 * @property {number} page.required - offset in terms of pages - eg: 1 (first page, which means offset = pageSize * (page - 1))
 * @property {number} pageSize.required - number of results to return - eg: 10
 * @property {string} field.required - field to search in for suggestions - eg: 'handle'
 */

/**
 * POST /search/suggest/all
 * @summary Get suggestions for channels & profiles by given search query (both)
 * @tags Search
 * @param {SuggestQuery} request.body.required - query to search for
 * @return {object} 200 - An object of suggested channels & profiles
 */
searchRouter.post('/suggest/all', suggestAll);

/**
 * POST /search/suggest/channel
 * @summary Get suggestions for channels by given search query
 * @tags Search
 * @param {SuggestQuery} request.body.required - query to search for
 * @return {object} 200 - An object of suggested channels
 */
searchRouter.post('/suggest/channel', suggestChannels);

/**
 * POST /search/suggest/profile
 * @summary Get suggestions for profiles by given search query
 * @tags Search
 * @param {SuggestQuery} request.body.required - query to search for
 * @return {object} 200 - An object of suggested profiles
 */
searchRouter.post('/suggest/profile', suggestProfiles);
