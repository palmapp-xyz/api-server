import * as admin from 'firebase-admin';
import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';

import {SSXServer, SSXExpressMiddleware} from '@spruceid/ssx-server';

import config from './config';
import {apiRouter} from './apiRouter';
import {errorHandler} from './middlewares/errorHandler';
import * as functions from 'firebase-functions';
import swaggerui from 'swagger-ui-express';
import {authRouter} from './auth/authRouter';
import {searchRouter} from './search/router';
import {initListeners} from './search/listenerFunctions';
import {notificationRouter} from './notification/router';
import {initNotifiers} from './notification/listenerFunction';

// eslint-disable-next-line etc/no-commented-out-code
// import {getSwagger} from './swagger';

import serviceAccount from '../firebase-adminsdk.json';

// initialize admin
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
export const firestore = firebaseApp.firestore();

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/api', apiRouter);
app.use('/docs', swaggerui.serve);
app.use('/search', searchRouter);
app.use('notification', notificationRouter);

const ssx = new SSXServer({
  signingKey: config.SSX_SECRET,
  providers: {
    metrics: {service: 'ssx', apiKey: config.SSX_API_KEY},
  },
});

app.use(SSXExpressMiddleware(ssx));


app.get('/', (req, res) => {
  res.send('Palm server side');
});

app.get('/docs', swaggerui.setup(import('../swagger.json')));
app.use(errorHandler);

// functions should be deployed to specific region 'asia-northeast3'
export const v1 = functions.region('asia-northeast3').https.onRequest(app);

// elastic search indexing functions
const indexers = initListeners();
export const {
  onProfileCreate,
  onProfileUpdate,
  onProfileDelete,
  onChannelCreate,
  onChannelUpdate,
  onChannelDelete,
} = indexers;

// notification functions

const notifiers = initNotifiers();
export const {
  onListingCreated,
  onListingUpdated,
} = notifiers;

