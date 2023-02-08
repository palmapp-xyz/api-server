import * as dotenv from 'dotenv';
import {cleanEnv, num, str} from 'envalid';

dotenv.config({path: `.env.${process.env.NODE_ENV}`});

export default cleanEnv(process.env, {
  HOST: str(),

  PORT: num(),

  MORALIS_API_KEY: str(),

  NGROK_AUTH_TOKEN: str(),
});

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable '${name}' is not set`);
  }
  return value;
}

function readEnvPrivateKey(name: string): string {
  const privateKey = readEnv(name);
  return `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
}

export const appConfig = {
  serviceAccountPrivateKeyId: readEnv('SERVICE_ACCOUNT_PRIVATE_KEY_ID'),
  serviceAccountEmail: readEnv('SERVICE_ACCOUNT_EMAIL'),
  serviceAccountPrivateKey: readEnvPrivateKey('SERVICE_ACCOUNT_PRIVATE_KEY'),
};
