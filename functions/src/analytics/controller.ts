import {Request, Response, NextFunction} from 'express';
import {init, logEvent} from '@amplitude/analytics-node';
import config from '../config';

// Initialize Amplitude SDK
init(config.AMPLITUDE_API_KEY);

// controller to log event in Amplitude
export const logEventController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the document ID
    const {profileId, eventType, eventData} = req.body;

    // profileId, eventType, eventData are required
    if (!profileId || !eventType || !eventData) {
      res.status(400).json({message: 'profileId, eventType, eventData are required'});
      return;
    }

    // Get the timestamp
    const timestamp = Date.now();

    // Log the event in Amplitude
    logEvent({
      user_id: profileId,
      event_type: eventType,
      time: timestamp,
      event_properties: {data: eventData},
    });
    res.status(200).json({message: 'Event logged in Amplitude'});
  } catch (error) {
    next(error);
  }
};
