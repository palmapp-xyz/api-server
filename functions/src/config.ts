import * as dotenv from 'dotenv';

dotenv.config({path: `.env.${process.env.NODE_ENV}`});

const config = {
  HOST: readEnv('HOST'),

  // eslint-disable-next-line etc/no-commented-out-code
  // PORT: Number(readEnv('PORT')),

  MORALIS_API_KEY: readEnv('MORALIS_API_KEY'),

  NGROK_AUTH_TOKEN: readEnv('NGROK_AUTH_TOKEN'),
  MORALIS_STREAM_ID: readEnv('MORALIS_STREAM_ID'),

};

export default config;

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
