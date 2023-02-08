import {hookRouter} from './hook';
import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import config from './config';
import {apiRouter} from './apiRouter';
import {errorHandler} from './middlewares/errorHandler';
import {streamRouter} from './stream/streamRouter';
// import ngrok from 'ngrok';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {profileRouter} from './profile/profileRouter';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import swaggerui from 'swagger-ui-express';

const firebaseApp = admin.initializeApp();
export const firestore = firebaseApp.firestore();

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors({origin: true}));

app.use('/api', apiRouter);
app.use('/hooks', hookRouter);
app.use('/profile', profileRouter);
app.use('/stream', streamRouter);
app.use('/docs', swaggerui.serve);

app.get('/docs', swaggerui.setup(import('./swagger.json')));

app.use(errorHandler);

app.use(express.static('public'));

app.listen(config.PORT, async () => {
  // const url = await ngrok.connect({ authtoken: config.NGROK_AUTH_TOKEN, addr: config.PORT });
  // eslint-disable-next-line no-console
  console.log(`'Oedi Moralis server' is running on port ${config.PORT}`);
});

export default {app, expressJSDocSwagger};
export const v1 = functions.https.onRequest(app);
