import * as dotenv from 'dotenv';

dotenv.config({path: `.env.${process.env.NODE_ENV}`});

const config = {
  HOST: readEnv('HOST'),

  PORT: Number(readEnv('PORT')),

  MORALIS_API_KEY: readEnv('MORALIS_API_KEY'),

  MORALIS_STREAM_ID: readEnv('MORALIS_STREAM_ID'),

  NGROK_AUTH_TOKEN: readEnv('NGROK_AUTH_TOKEN'),

  KAS_API_ACCESS_KEY_ID: readEnv('KAS_API_ACCESS_KEY_ID'),

  KAS_API_SECRET_ACCESS_KEY: readEnv('KAS_API_SECRET_ACCESS_KEY'),

  KAS_ENDPOINT: readEnv('KAS_ENDPOINT'),

  ELASTIC_APP_SEARCH_KEY: readEnv('ELASTIC_APP_SEARCH_KEY'),

  ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME: readEnv('ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME'),

  ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME: readEnv('ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME'),

  ELASTIC_APP_SEARCH_ENDPOINT: readEnv('ELASTIC_APP_SEARCH_ENDPOINT'),

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
