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
import {addAddress} from './stream/streamService';
import feedRouter from "./feed/feedRouter";
// eslint-disable-next-line etc/no-commented-out-code
// import {getSwagger} from './Swagger';

// initialize admin
const firebaseApp = admin.initializeApp();
export const firestore = firebaseApp.firestore();

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.json());
// should allow all origins
app.options('*', cors());
app.use(cors());

app.use('/docs', swaggerui.serve);
app.use('/jwt', jwtRouter);
app.use('/api', apiRouter);
app.use('/stream', streamRouter);
app.use('/profile', profileRouter);
// eslint-disable-next-line etc/no-commented-out-code
// app.use('/offer', offerRouter);
app.use('/feed', feedRouter);


// eslint-disable-next-line no-inline-comments
// getSwagger(app); // creating swagger.json file
app.get('/docs', swaggerui.setup(import('../swagger.json')));
app.use(errorHandler);
// functions should be deployed to specific region 'asia-northeast3'
export const v1 = functions.region('asia-northeast3').https.onRequest(app);

