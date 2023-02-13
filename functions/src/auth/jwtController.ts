import {NextFunction, Request, Response} from 'express';
import axios from 'axios';
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithCustomToken} from 'firebase/auth';
// custome token to id token generation function
/**
 *  idTokenGenertor function
 * @param {Request} req - request
 * @param {Response} res - response
 * @param {NextFunction} next - Express next function
 * @return {json} - id token
 * @throws - error if signature, message & networkType is not present
 * @throws - error if firebase app is not initialized
 * @throws - error if firebase auth is not initialized
 *
 */
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
    // eslint-disable-next-line no-console
    // console.log('projectId', functions.config().project.id);
    // trigger ext-moralis-auth-issueToken post function to convert signature, message & networkType to custom token using axios
    const response = await axios.post(
        `https://asia-northeast3-oedi-a1953.cloudfunctions.net/ext-moralis-auth-issueToken`,
        {
          data: {
            signature,
            message,
            networkType,
          },
        },
    );
    // eslint-disable-next-line no-console
    console.log(response.data);
    // res.status(200).json({result: response.data.result});
    // initialize firebase app with firebase config to convert custom token to id token
    // eslint-disable-next-line etc/no-commented-out-code
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
    res.status(200).json({result: {idToken}});
  } catch (err) {
    next(err);
  }
}
