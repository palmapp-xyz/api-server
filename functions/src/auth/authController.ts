import {NextFunction, Request, Response} from 'express';
import axios, {AxiosResponse} from 'axios';
import * as admin from 'firebase-admin';
import config from '../config';
import {AuthChallengeInfo, AuthChallengeResult, Profile} from './auth';
import {UserRecord} from 'firebase-admin/auth';
import * as functions from 'firebase-functions';

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

    // to support arbitrary wallet-to-wallet messaging
    // TODO remove once on-chain profiles are integrated
    const {profileId} = response.data;
    const userRecord: UserRecord = await admin.auth().getUser(profileId);
    if (!userRecord) {
      functions.logger.log(`challengeRequest: creating a new user ${profileId}`);
      await admin.auth().createUser({uid: profileId});
    }
    const userSnapshot = await admin.firestore().collection('profiles').doc(profileId).get();
    if (!userSnapshot.exists) {
      const profileField: Profile = {
        profileId,
        address,
        verified: false,
      };
      await admin.firestore().collection('profiles').doc(profileId).set(profileField);
    }

    functions.logger.log(`challengeRequest return ${JSON.stringify(response.data)}`);
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

  functions.logger.log(`challengeVerify message: ${message}, signature: ${signature}`);
  try {
    // trigger ext-moralis-auth-issueToken post function to convert signature, message & networkType to custom token using axios
    const response: AxiosResponse<AuthChallengeResult> = await axios.post(
        `https://authapi.moralis.io/challenge/verify/evm`,
        {
          message,
          signature,
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-API-Key': config.MORALIS_API_KEY,
            'accept': 'application/json',
          },
        }
    );

    const {profileId} = response.data;
    const profileField: Profile = {
      profileId,
      address: response.data.address,
      verified: true,
    };
    const userSnapshot = await admin.firestore().collection('profiles').doc(response.data.profileId).get();
    if (!userSnapshot.exists) {
      throw new Error(`User with profile id ${profileId} does not exist`);
    } else {
      await admin.firestore().collection('profiles').doc(profileId).set(profileField, {merge: true});
    }

    functions.logger.log(`challengeVerify return: ${JSON.stringify(response.data)}`);
    res.send(response.data);
  } catch (err) {
    next(err);
  }
}
