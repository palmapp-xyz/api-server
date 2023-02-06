import * as dotenv from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default cleanEnv(process.env, {
  HOST: str(),

  PORT: num(),

  MORALIS_API_KEY: str(),

  NGROK_AUTH_TOKEN: str(),
});
