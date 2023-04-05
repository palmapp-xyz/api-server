import * as admin from 'firebase-admin';
import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import config from './config';
import {apiRouter} from './apiRouter';
import {errorHandler} from './middlewares/errorHandler';
import {streamRouter} from './stream/streamRouter';
import * as functions from 'firebase-functions';
import {profileRouter} from './profile/profileRouter';
import swaggerui from 'swagger-ui-express';
import {jwtRouter} from './auth/jwtRouter';
import {offerRouter} from './offer/offerRouter';
import {searchRouter} from './search/router';
import {addDocuments, deleteDocuments, updateDocuments} from './search/controller';
import {SSXServer, SSXExpressMiddleware} from '@spruceid/ssx-server';

// eslint-disable-next-line etc/no-commented-out-code
// import {getSwagger} from './Swagger';

// initialize admin
const firebaseApp = admin.initializeApp();
export const firestore = firebaseApp.firestore();

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

// eslint-disable-next-line no-console
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// For parsing application/json:
// should allow all origins
app.use(cors());

app.use('/jwt', jwtRouter);
app.use('/api', apiRouter);
app.use('/stream', streamRouter);
app.use('/profile', profileRouter);
app.use('/offer', offerRouter);
app.use('/docs', swaggerui.serve);
app.use('/search', searchRouter);

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

// eslint-disable-next-line no-inline-comments
// getSwagger(app); // creating swagger.json file
app.get('/docs', swaggerui.setup(import('../swagger.json')));
app.use(errorHandler);
// functions should be deployed to specific region 'asia-northeast3'
export const dev = functions.region('asia-northeast3').https.onRequest(app);


export const onProfileCreate = functions.firestore
    .document('profiles/{profileId}')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onCreate(async (snap, context) => {
      const data = snap.data();
      const docId = snap.id;
      const doc = {
        id: docId,
        ...data,
      };
      await addDocuments(config.ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME, [doc]);
    });
// firebase function to trigger upone document update in firestore
export const onProfileUpdate = functions.firestore
    .document('profiles/{profileId}')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onUpdate(async (change, context) => {
      const data = change.after.data();
      const docId = change.after.id;
      const doc = {
        id: docId,
        ...data,
      };
      await updateDocuments(config.ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME, [doc]);
    } );

// firebase function to trigger upone document delete in firestore
export const onProfileDelete = functions.firestore
    .document('profiles/{profileId}')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onDelete(async (snap, context) => {
      const docId = snap.id;
      await deleteDocuments(config.ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME, [docId]);
    } );

// firebase function to trigger upon channel document create in firestore
export const onChannelCreate = functions.firestore
    .document('channels/{channelId}')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onCreate(async (snap, context) => {
      const data = snap.data();
      const docId = snap.id;
      const doc = {
        id: docId,
        ...data,
      };
      await addDocuments(config.ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME, [doc]);
    } );

// firebase function to trigger upon channel document update in firestore
export const onChannelUpdate = functions.firestore
    .document('channels/{channelId}')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onUpdate(async (change, context) => {
      const data = change.after.data();
      const docId = change.after.id;
      const doc = {
        id: docId,
        ...data,
      };
      await updateDocuments(config.ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME, [doc]);
    } );

// firebase function to trigger upon channel document delete in firestore
export const onChannelDelete = functions.firestore
    .document('channels/{channelId}')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onDelete(async (snap, context) => {
      const docId = snap.id;
      await deleteDocuments(config.ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME, [docId]);
    } );
