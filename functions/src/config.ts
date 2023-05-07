import * as dotenv from 'dotenv';
import * as functions from 'firebase-functions';

dotenv.config({path: `.env.${functions.config().config.env}`});

const config = {
  ENV_NAME: readEnv('ENV_NAME'),

  MORALIS_API_KEY: readEnv('MORALIS_API_KEY'),

  KAS_API_ACCESS_KEY_ID: readEnv('KAS_API_ACCESS_KEY_ID'),
  KAS_API_SECRET_ACCESS_KEY: readEnv('KAS_API_SECRET_ACCESS_KEY'),
  KAS_ENDPOINT: readEnv('KAS_ENDPOINT'),

  ELASTIC_SEARCH_PROFILE_INDEX: readEnv('ELASTIC_SEARCH_PROFILE_INDEX'),
  ELASTIC_SEARCH_CHANNEL_INDEX: readEnv('ELASTIC_SEARCH_CHANNEL_INDEX'),

  ELASTIC_SEARCH_USERNAME: readEnv('ELASTIC_SEARCH_USERNAME'),
  ELASTIC_SEARCH_PASSWORD: readEnv('ELASTIC_SEARCH_PASSWORD'),
  ELASTIC_SEARCH_CLOUD_ID: readEnv('ELASTIC_SEARCH_CLOUD_ID'),
  ELASTIC_SEARCH_API_KEY: readEnv('ELASTIC_SEARCH_API_KEY'),

  SENDBIRD_APP_ID: readEnv('SENDBIRD_APP_ID'),
  SENDBIRD_API_TOKEN: readEnv('SENDBIRD_API_TOKEN'),
  SENDBIRD_API_URL: readEnv('SENDBIRD_API_URL'),

  RPC_URL: readEnv('RPC_URL'),
};

export default config;

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable '${name}' is not set.`);
  }
  return value;
}

export const isTestnet = (): boolean => (config.ENV_NAME === 'testnet');
