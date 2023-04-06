import {Router} from 'express';
import {fetchChannel, fetchProfile, suggestChannelsByName, suggestProfilesByHandle} from './controller';
export const searchRouter = Router();

/**
 * GET /search/profile/suggestions/:handle
 * @summary Get suggestions for profiles by handle prefix
 * @tags Search
 *
 * @param {string} handle.path.required - handle prefix
 * @return {object} 200 - An array of profiles suggestions
 * @return {Error}  default - Unexpected error
 *
 */
searchRouter.get('/profile/suggestions/:handle', suggestProfilesByHandle);

/**
 * GET /search/profile/:handle
 * @summary Get profile by handle
 * @tags Search
 *
 * @param {string} handle.path.required - handle
 * @return {object} 200 - A profile
 * @return {Error}  default - Unexpected error
 *
 */
searchRouter.get('/profile/:handle', fetchProfile);

/**
 * GET /search/channel/suggestions/:name
 * @summary Get suggestions for channels by name prefix
 * @tags Search
 *
 * @param {string} name.path.required - name prefix
 * @return {object} 200 - An array of channel suggestions
 * @return {Error}  default - Unexpected error
 *
 */
searchRouter.get('/channel/suggestions/:name', suggestChannelsByName);

/**
 * GET /search/channel/:name
 * @summary Get channel by name
 * @tags Search
 *
 * @param {string} name.path.required - name
 * @return {object} 200 - A channel
 * @return {Error}  default - Unexpected error
 *
 */
searchRouter.get('/channel/:name', fetchChannel);
