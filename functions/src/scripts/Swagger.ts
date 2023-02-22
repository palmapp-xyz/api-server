import expressJSDocSwagger from 'express-jsdoc-swagger';
import {writeFileSync} from 'fs';
import express from 'express';
import cors from 'cors';
import {jwtRouter} from '../auth/jwtRouter';
import {apiRouter} from '../apiRouter';
import {streamRouter} from '../stream/streamRouter';
import {profileRouter} from '../profile/profileRouter';
import {friendRouter} from '../friends/friendRouter';
import {errorHandler} from '../middlewares/errorHandler';

export const app = express();
const options = {
  info: {
    version: '1.0.0',
    title: 'Oedi API',
    description: 'Oedi API powered by Firebase Functions and Moralis, base_url: https://us-central1-oedi-a1953.cloudfunctions.net/api ',
  },
  security: {
    JWT: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  // Base directory which we use to locate your JSDOC files
  baseDir: __dirname,
  // eslint-disable-next-line max-len
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  // eslint-disable-next-line max-len
  filesPattern: ['./stream/streamRouter.js', './apiRouter.js', './profile/profileRouter.js', './swagger-auth.js', './auth/jwtRouter.js'],
  exposeSwaggerUI: true,
};
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// should allow all origins
app.use(cors());

app.use('/jwt', jwtRouter);
app.use('/api', apiRouter);
app.use('/stream', streamRouter);
app.use('/profile', profileRouter);
// eslint-disable-next-line etc/no-commented-out-code
// app.use('/offer', offerRouter);
app.use('/friends', friendRouter);
app.use(errorHandler);
const eventEmitter = expressJSDocSwagger(app)(options);

eventEmitter.on('finish', (swaggerObject) => {
  writeFileSync('./swagger.json', JSON.stringify(swaggerObject));
  // eslint-disable-next-line no-console
  console.log('swagger.json created');
});

