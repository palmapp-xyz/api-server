import * as dotenv from "dotenv";
import {cleanEnv, str} from "envalid";

dotenv.config();

export default cleanEnv(process.env, {
  MORALIS_API_KEY: str(),
});
