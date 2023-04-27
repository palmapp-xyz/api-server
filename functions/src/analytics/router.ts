import {Router} from 'express';
import {logEventController} from './controller';

export const analyticsRouter = Router();

/**
 * @typedef {object} LogEvent
 * @property {string} profileId.required - profileId of user - eg: '0x123...'
 * @property {string} eventType.required - eventType - eg: 'TOKEN_TRANSFER'
 * @property {object} eventData.required - eventData - eg: {token: '0x123...', amount: 100}
 * /

/**
 * POST /analytics/logEvent
 * @summary Log event in Amplitude
 * @tags Analytics
 *
 * @param {LogEvent} request.body.required - event to log
 * @return {object} 200 - A message that event was logged
 * @return {Error}  default - Unexpected error
 *
 * */

analyticsRouter.post('/logEvent', logEventController);
