import * as dotenv from 'dotenv';

dotenv.config({path: `.env.${process.env.NODE_ENV}`});

const config = {
  HOST: readEnv('HOST'),
  PORT: Number(readEnv('PORT')),

  MORALIS_API_KEY: readEnv('MORALIS_API_KEY'),

  NGROK_AUTH_TOKEN: readEnv('NGROK_AUTH_TOKEN'),

  KAS_API_ACCESS_KEY_ID: readEnv('KAS_API_ACCESS_KEY_ID'),
  KAS_API_SECRET_ACCESS_KEY: readEnv('KAS_API_SECRET_ACCESS_KEY'),
  KAS_ENDPOINT: readEnv('KAS_ENDPOINT'),

  SSX_API_KEY: readEnv('SSX_API_KEY'),
  SSX_SECRET: readEnv('SSX_SECRET'),

  ELASTIC_SEARCH_PROFILE_INDEX_NAME: readEnv('ELASTIC_SEARCH_PROFILE_INDEX_NAME'),
  ELASTIC_SEARCH_CHANNEL_INDEX_NAME: readEnv('ELASTIC_SEARCH_CHANNEL_INDEX_NAME'),
  ELASTIC_SEARCH_USERNAME: readEnv('ELASTIC_SEARCH_USERNAME'),
  ELASTIC_SEARCH_PASSWORD: readEnv('ELASTIC_SEARCH_PASSWORD'),
  ELASTIC_SEARCH_CLOUD_ID: readEnv('ELASTIC_SEARCH_CLOUD_ID'),
  ELASTIC_SEARCH_API_KEY: readEnv('ELASTIC_SEARCH_API_KEY'),

  FIREBASE_API_KEY: readEnv('FIREBASE_API_KEY'),
  FIREBASE_AUTH_DOMAIN: readEnv('FIREBASE_AUTH_DOMAIN'),
  FIREBASE_PROJECT_ID: readEnv('FIREBASE_PROJECT_ID'),
  FIREBASE_STORAGE_BUCKET: readEnv('FIREBASE_STORAGE_BUCKET'),
  FIREBASE_MESSAGING_SENDER_ID: readEnv('FIREBASE_MESSAGING_SENDER_ID'),
  FIREBASE_APP_ID: readEnv('FIREBASE_APP_ID'),

};

export default config;

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable '${name}' is not set.`);
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
