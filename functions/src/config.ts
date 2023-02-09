import * as dotenv from 'dotenv';
// eslint-disable-next-line no-console
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
dotenv.config({path: `.env.${process.env.NODE_ENV}`});

const config = {
  MORALIS_API_KEY: readEnv('MORALIS_API_KEY'),
};

export default config;

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable '${name}' is not set`);
  }
  return value;
}
