import {Router} from 'express';
import {
  searchChannels,
  searchProfiles,
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
