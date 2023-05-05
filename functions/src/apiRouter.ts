import express from "express";
import rateLimit, { MemoryStore } from "express-rate-limit";

import { ProxyGenerator } from "./api/proxyGenerator";
import config from "./config";

const apiLimiter = rateLimit({
  // 1 minute
  windowMs: 60 * 1000,
  // Limit each IP to 10 requests per `window` (here, per minute)
  max: 10,
  // Return rate limit info in the `RateLimit-*` headers
  standardHeaders: true,
  store: new MemoryStore(),
});

export const apiRouter = express.Router();

const evmProxyRouter = new ProxyGenerator("evm", {
  apiKey: config.MORALIS_API_KEY,
  api_key_id: config.KAS_API_ACCESS_KEY_ID,
  api_secret: config.KAS_API_SECRET_ACCESS_KEY,
});

/**
 *
 */
apiRouter.use("/evm-api-proxy", apiLimiter, evmProxyRouter.getRouter());
