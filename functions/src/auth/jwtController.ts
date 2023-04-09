import {NextFunction, Request, Response} from 'express';
import axios from 'axios';
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithCustomToken} from 'firebase/auth';
import config from '../config';
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
        `https://asia-northeast1-${config.FIREBASE_PROJECT_ID}.cloudfunctions.net/ext-moralis-auth-issueToken`,
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
      apiKey: config.FIREBASE_API_KEY,
      authDomain: config.FIREBASE_AUTH_DOMAIN,
      projectId: config.FIREBASE_PROJECT_ID,
      storageBucket: config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
      appId: config.FIREBASE_APP_ID,
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
