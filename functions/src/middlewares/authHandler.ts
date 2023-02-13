import {NextFunction, Request, Response} from 'express';
import * as admin from 'firebase-admin';

// eslint-disable-next-line require-jsdoc
export async function isAuthenticated(
    // eslint-disable-next-line
    req: Request, res: Response, next: NextFunction
) {
  const {authorization} = req.headers;

  if (!authorization) {
    return res.status(401).send(
        {message: 'Unauthorized: No authorization header'});
  }

  if (!authorization.startsWith('Bearer')) {
    return res.status(401).send({message: 'Unauthorized: No Bearer'});
  }

  const split = authorization.split('Bearer ');
  if (split.length !== 2) {
    return res.status(401).send(
        {message: 'Unauthorized: invalid token format'});
  }

  const token = split[1];

  try {
    const decodedToken: admin.auth.DecodedIdToken =
        await admin.auth().verifyIdToken(token);
    // eslint-disable-next-line no-console
    console.log('decodedToken', JSON.stringify(decodedToken));
    res.locals = {
      // eslint-disable-next-line max-len
      ...res.locals, uid: decodedToken.uid, role: decodedToken.role, displayName: decodedToken.name,
    };
    return next();
  } catch (err) {
    // eslint-disable-next-line etc/no-commented-out-code
    // console.error(`${err.code} -  ${err.message}`)
    return res.status(401).send({message: 'Unauthorized: invalid token'});
  }
}
