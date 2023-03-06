import {Request, Response, NextFunction} from 'express';
import {firestore as db} from 'firebase-admin';
import Axios from 'axios';
import config from '../config';

// initializing sendbird sdk

// get sendbird app id from env
const appId = config.SENDBIRD_APP_ID;
export const refreshSessionToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const URL = `https://api-${appId}.sendbird.com/v3/users/${res.locals.displayName}/token`;
    const response = await Axios.post(URL, {
      // set token expiration time 1 day
      'expires_at': Math.floor(Date.now() / 1000) + 86400,
    });
    await db()
        .collection('profile')
        .doc(res.locals.displayName)
        .set({
          'sendbird_token': response.data.access_token,
        },
        {
          merge: true,
        });
    res.status(200).json({token: response.data.access_token});
  } catch (error) {
    next(error);
  }
};

export const revokeAllSessionTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const URL = `https://api-${appId}.sendbird.com/v3/users/${res.locals.displayName}/token`;
    await Axios.delete(URL);
    await db()
        .collection('profile')
        .doc(res.locals.displayName)
        .set({
          'sendbird_token': '',
        },
        {
          merge: true,
        });
    res.status(200).json({message: 'all session tokens revoked'});
  } catch (error) {
    next(error);
  }
};
