import {Router} from 'express';
import {releaseWeb3Message} from './controller';

const web3MessageRouter = Router();
export default web3MessageRouter;

web3MessageRouter.post('/release', releaseWeb3Message); // TODO: should protect this route with auth middleware e.g: authMiddleware (need to update authMiddleware as per latest auth changes)
