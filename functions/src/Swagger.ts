import expressJSDocSwagger from 'express-jsdoc-swagger';
import {writeFileSync} from 'fs';
import {Express} from 'express';


const options = {
  info: {
    version: '1.0.0',
    title: 'Palm API',
    description: 'Palm API powered by Firebase Functions and Moralis, base_url: https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1 ',
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
  filesPattern: ['./stream/streamRouter.js', './apiRouter.js', './profile/profileRouter.js', './swagger-auth.js', './auth/jwtRouter.js', './friends/friendRouter.js', './feed/feedRouter.js'],
  exposeSwaggerUI: true,
};

export function getSwagger(app: Express) {
  const eventEmitter = expressJSDocSwagger(app)(options);
  eventEmitter.on('finish', (swaggerObject) => {
    writeFileSync('./swagger.json', JSON.stringify(swaggerObject));
  });
}
