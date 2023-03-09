import {Request, Response, NextFunction} from 'express';
import {firestore as db} from 'firebase-admin';
import Axios from 'axios';
import config from '../config';

// initializing sendbird sdk

// get sendbird app id from env
const appId = config.SENDBIRD_APP_ID;

// create sendbird user
// eslint-disable-next-line consistent-return
export const createSendbirdUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const URL = `https://api-${appId}.sendbird.com/v3/users`;
    const response = await Axios.post(URL, {
      'user_id': res.locals.displayName,
      'nickname': req.body.user_name,
      'profile_url': req.body.nft_image_url,
    }, {
      headers: {
        'Api-Token': config.SENDBIRD_API_TOKEN,
      },
    });
    // log response
    // eslint-disable-next-line no-console
    console.log(response.data);
    return next();
  } catch (err) {
    next(err);
  }
};
export const refreshSessionToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const URL = `https://api-${appId}.sendbird.com/v3/users/${res.locals.displayName}/token`;
    const response = await Axios.post(URL, {
      // set token expiration time 1 day
      'expires_at': Math.floor(Date.now() / 1000) + 86400,
    },
    {
      headers: {
        'Api-Token': config.SENDBIRD_API_TOKEN,
      },
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
