import cors from "cors";
import express from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import Moralis from "moralis";
import swaggerui from "swagger-ui-express";
import { LensClient, development, production } from "@lens-protocol/client";

// import {getSwagger} from './swagger';
import serviceAccountMainnet from "../firebase-admin-mainnet.json";
import serviceAccountTestnet from "../firebase-admin-testnet.json";
import { apiRouter } from "./apiRouter";
import { authRouter } from "./auth/authRouter";
import config, { isTestnet } from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import { initNotifiers } from "./notification/listenerFunction";
import { notificationRouter } from "./notification/router";
import { deleteCollection, getAllUsers } from "./scripts/deleteAllUsers";
import { initListeners } from "./search/listenerFunctions";
import { searchRouter } from "./search/router";

// initialize admin
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(
    (isTestnet()
      ? serviceAccountTestnet
      : serviceAccountMainnet) as admin.ServiceAccount
  ),
});
export const firestore = firebaseApp.firestore();

export const lensClient = new LensClient({
  environment:
    process.env.NODE_ENV !== "development" ? development : production,
});

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use("/docs", swaggerui.serve);
app.use("/search", searchRouter);
app.use("notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("Palm server side");
});

app.delete("/deleteAllUsers", (req, res) => {
  if (process.env.NODE_ENV !== "development") {
    res.status(401);
    res.json({ message: `Unauthorized` });
  }

  getAllUsers(0);
  res.send("Deleted All Users");
});
app.delete("/deleteChannels", (req, res) => {
  if (process.env.NODE_ENV !== "development") {
    res.status(401);
    res.json({ message: `Unauthorized` });
  }

  deleteCollection("channels");
  res.send("Deleted All Channels");
});
app.delete("/deleteListings", (req, res) => {
  if (process.env.NODE_ENV !== "development") {
    res.status(401);
    res.json({ message: `Unauthorized` });
  }

  deleteCollection("listings");
  res.send("Deleted All Listings");
});

app.get("/docs", swaggerui.setup(import("../swagger.json")));
app.use(errorHandler);

// functions should be deployed to specific region 'asia-northeast3'
export const v1 = functions.region("asia-northeast3").https.onRequest(app);

// elastic search indexing functions
const indexers = initListeners();
export const {
  onProfileCreate,
  onProfileUpdate,
  onProfileDelete,
  onChannelCreate,
  onChannelUpdate,
  onChannelDelete,
} = indexers;

// notification functions

const notifiers = initNotifiers();
export const { onListingCreated, onListingUpdated } = notifiers;
