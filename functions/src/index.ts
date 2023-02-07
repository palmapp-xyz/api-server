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
// import {writeFileSync} from "fs";
import swaggerui from "swagger-ui-express";
import swagger from "../swagger.json";
// import {cert} from "firebase-admin/app";
// initialize admin
const firebaseApp = admin.initializeApp();
export const firestore = firebaseApp.firestore();

const options = {
  info: {
    version: "1.0.0",
    title: "Oedi API",
    description: "Oedi API powered by Firebase Functions and Moralis, base_url: https://us-central1-oedi-a1953.cloudfunctions.net/api ",
  },
  security: {
    JWT: {
      type: "http",
      scheme: "bearer",
    },
  },
  // Base directory which we use to locate your JSDOC files
  baseDir: __dirname,
  // eslint-disable-next-line max-len
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  // eslint-disable-next-line max-len
  filesPattern: ["./stream/streamRouter.js", "./apiRouter.js", "./profile/profileRouter.js", "./swagger.js"],
  exposeSwaggerUI: true,
};
// initializing admin
// admin.initializeApp();

const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});
// eslint-disable-next-line no-console
console.log("HELLO THERE!!!!>>>>");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors({origin: true}));
app.use("/api", apiRouter);
app.use("/stream", streamRouter);
app.use("/profile", profileRouter);
app.use("/docs/", swaggerui.serve, swaggerui.setup(swagger, {explorer: true}));
app.use(errorHandler);
// create swagger json and swagger ui from express-jsdoc-swagger
expressJSDocSwagger(app)(options);
/* let eventEmitter = */
/* eventEmitter.on("finish", (swaggerObject) => {
    console.log("Swagger generated");
   writeFileSync("./swagger.json", JSON.stringify(swaggerObject, null, 2));
})*/

export const api = functions.https.onRequest(app);

// export const api = functions.region("asia-northeast3").https.onRequest(app);
