"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
var express_1 = __importDefault(require("express"));
var proxyGenerator_1 = require("./api/proxyGenerator");
var config_1 = __importDefault(require("./config"));
var express_rate_limit_1 = __importStar(require("express-rate-limit"));
var apiLimiter = (0, express_rate_limit_1.default)({
    // 1 minute
    windowMs: 60 * 1000,
    // Limit each IP to 10 requests per `window` (here, per minute)
    max: 10,
    // Return rate limit info in the `RateLimit-*` headers
    standardHeaders: true,
    store: new express_rate_limit_1.MemoryStore(),
});
exports.apiRouter = express_1.default.Router();
var evmProxyRouter = new proxyGenerator_1.ProxyGenerator("evm", {
    apiKey: config_1.default.MORALIS_API_KEY,
});
/**
 *
 */
exports.apiRouter.use("/evm-api-proxy", apiLimiter, evmProxyRouter.getRouter());
