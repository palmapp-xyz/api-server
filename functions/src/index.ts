import * as admin from "firebase-admin";
import Moralis from "moralis";
import express from "express";
import cors from "cors";
import config from "./config";
import {apiRouter} from "./apiRouter";
import {errorHandler} from "./middlewares/errorHandler";
import {streamRouter} from "./stream/streamRouter";
import * as functions from "firebase-functions";
import {profileRouter} from "./profile/profileRouter";
import expressJSDocSwagger from "express-jsdoc-swagger";
import swaggerui from "swagger-ui-express";
// import {getSwagger} from "./Swagger";
// initialize admin
const firebaseApp = admin.initializeApp();
export const firestore = firebaseApp.firestore();

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});
// eslint-disable-next-line no-console
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors({origin: true}));
app.use("/api", apiRouter);
app.use("/stream", streamRouter);
app.use("/profile", profileRouter);
app.use("/docs", swaggerui.serve);
// eslint-disable-next-line no-inline-comments
// getSwagger(app); // creating swagger.json file
app.get("/docs", swaggerui.setup(import("./swagger.json")));
app.use(errorHandler);
export default {app, expressJSDocSwagger};
export const v1 = functions.https.onRequest(app);
