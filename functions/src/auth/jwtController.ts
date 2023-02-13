import {NextFunction, Request, Response} from 'express';
import * as functions from 'firebase-functions';
import axios from 'axios';
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithCustomToken} from 'firebase/auth';
// custome token to id token generation function

export async function idTokenGenertor(req: Request, res: Response, next: NextFunction) {
  // get signature, message & networkType from req.body
  const {signature, message, networkType} = req.body;
  // check if signature, message & networkType is present
  if (!signature || !message || !networkType) {
    // eslint-disable-next-line etc/no-commented-out-code
    // throw error
    throw new Error('signature, message & networkType is required');
  }
  try {
    // trigger ext-moralis-auth-issueToken post function to convert signature, message & networkType to custom token using axios
    const response = await axios.post(
        `https://asia-northeast1-${functions.config().project.id}.cloudfunctions.net/ext-moralis-auth-issueToken`,
        {
          data: {
            signature,
            message,
            networkType,
          },
        },
    );

    // initialize firebase app
    const firebaseConfig = {
      apiKey: 'AIzaSyARxuVV-AJdLNj2kz_4yArs-CWEvML4u2o',
      authDomain: 'oedi-a1953.firebaseapp.com',
      projectId: 'oedi-a1953',
      storageBucket: 'oedi-a1953.appspot.com',
      messagingSenderId: '219711213585',
      appId: '1:219711213585:web:6b625686c7f514699121b0',
    };
    // initialize app
    const app = initializeApp(firebaseConfig);
    // get auth instance
    const authInstance = getAuth(app);
    // sign in with custom token to get id token
    const userCredential = await signInWithCustomToken(authInstance, response.data.result.token);

    // get id token
    const idToken = await userCredential.user.getIdToken();
    // return id token
    res.json({
      idToken,
    });
  } catch (err) {
    next(err);
  }
}
