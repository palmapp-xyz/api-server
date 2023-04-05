import {Router} from 'express';
import {fetchChannel, fetchProfile, suggestChannelsByName, suggestProfilesByHandle} from './controller';
export const searchRouter = Router();

searchRouter.get('/profile/suggestions/:handle', suggestProfilesByHandle);
searchRouter.get('/profile/:handle', fetchProfile);
searchRouter.get('/channel/suggestions/:name', suggestChannelsByName);
searchRouter.get('/channel/:name', fetchChannel);
