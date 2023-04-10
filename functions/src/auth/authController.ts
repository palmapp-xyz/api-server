import {NextFunction, Request, Response} from 'express';
import axios, {AxiosResponse} from 'axios';
import * as admin from 'firebase-admin';
import config from '../config';
import {AuthChallengeInfo, AuthChallengeResult, Profile} from './auth';


export async function challengeRequest(req: Request, res: Response, next: NextFunction) {
  const {address, chainId} = req.body;
  if (!address || !chainId) {
    throw new Error('address, chainId are required');
  }
  try {
    const expirationTime = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));

    const response: AxiosResponse<AuthChallengeInfo> = await axios.post(
        `https://authapi.moralis.io/challenge/request/evm`,
        {
          'domain': 'palmapp.xyz',
          chainId,
          address,
          'statement': 'Please confirm',
          'uri': 'https://palmapp.xyz/',
          expirationTime,
          'timeout': 60,
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-API-Key': config.MORALIS_API_KEY,
            'accept': 'application/json',
          },
        }
    );
    res.send(response.data);
  } catch (err) {
    next(err);
  }
}

export async function challengeVerify(req: Request, res: Response, next: NextFunction) {
  const {message, signature} = req.body;
  if (!message || !signature) {
    throw new Error('message, signature are required');
  }
  try {
    // trigger ext-moralis-auth-issueToken post function to convert signature, message & networkType to custom token using axios
    const response: AxiosResponse<AuthChallengeResult> = await axios.post(
        `https://authapi.moralis.io/challenge/verify/evm`,
        {
          data: {
            message,
            signature,
          },
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-API-Key': config.MORALIS_API_KEY,
            'accept': 'application/json',
          },
        }
    );

    const userSnapshot = await admin.firestore().collection('profiles').doc(response.data.address).get();
    if (!userSnapshot.exists) {
      await admin.auth().createUser({uid: response.data.address});
      const profileField: Profile = {
        address: response.data.address,
      };
      await admin.firestore().collection('profiles').doc(response.data.address).set(profileField);
    }
    res.send(response.data);
  } catch (err) {
    next(err);
  }
}
