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
