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
exports.v1 = exports.app = exports.firestore = void 0;
var admin = __importStar(require("firebase-admin"));
var moralis_1 = __importDefault(require("moralis"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var config_1 = __importDefault(require("./config"));
var apiRouter_1 = require("./apiRouter");
var errorHandler_1 = require("./middlewares/errorHandler");
var streamRouter_1 = require("./stream/streamRouter");
var functions = __importStar(require("firebase-functions"));
var profileRouter_1 = require("./profile/profileRouter");
var express_jsdoc_swagger_1 = __importDefault(require("express-jsdoc-swagger"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// import {getSwagger} from "./Swagger";
// initialize admin
var firebaseApp = admin.initializeApp();
exports.firestore = firebaseApp.firestore();
exports.app = (0, express_1.default)();
moralis_1.default.start({
    apiKey: config_1.default.MORALIS_API_KEY,
});
// eslint-disable-next-line no-console
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({ origin: true }));
exports.app.use("/api", apiRouter_1.apiRouter);
exports.app.use("/stream", streamRouter_1.streamRouter);
exports.app.use("/profile", profileRouter_1.profileRouter);
exports.app.use("/docs", swagger_ui_express_1.default.serve);
// eslint-disable-next-line no-inline-comments
// getSwagger(app); // creating swagger.json file
exports.app.get("/docs", swagger_ui_express_1.default.setup(Promise.resolve().then(function () { return __importStar(require("./swagger.json")); })));
exports.app.use(errorHandler_1.errorHandler);
exports.default = { app: exports.app, expressJSDocSwagger: express_jsdoc_swagger_1.default };
exports.v1 = functions.https.onRequest(exports.app);
