// importing firebase admin
import * as admin from 'firebase-admin';
import {NextFunction, Request, Response} from 'express';

// writing a function to receive a message from the client and send notification to the user
export const sendNotification = (req: Request, res: Response, next: NextFunction) => {
  try {
    const {message, tokens} = req.body;
    // token should be an array of tokens with length > 0
    if (tokens === undefined || tokens.length === 0) {
      throw new Error('Invalid tokens');
    }
    const payload = {
      notification: {
        title: 'Notification',
        body: message,
        sound: 'default',
      },
    };
    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };
    const result = admin.messaging().sendToDevice(tokens, payload, options);
    res.status(200).json({result});
  } catch (error) {
    next(error);
  }
};
