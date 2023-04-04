import {Router} from 'express';
import {fetchChannel, fetchProfile, suggestChannelsByName, suggestProfilesByHandle} from './controller';
export const searchRouter = Router();

searchRouter.get('/profile/suggestion/:query', suggestProfilesByHandle);
searchRouter.get('/profile/:handle', fetchProfile);
searchRouter.get('/channel/suggestion/:query', suggestChannelsByName);
searchRouter.get('/channel/:name', fetchChannel);
