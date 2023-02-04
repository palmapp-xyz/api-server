
import Moralis from "moralis";
import express from "express";
import cors from "cors";
import config from "./config";
import {apiRouter} from "./apiRouter";
import {errorHandler} from "./middlewares/errorHandler";
import {streamRouter} from "./stream/streamRouter";
import * as functions from "firebase-functions";

const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors({origin: true}));

app.use("/api", apiRouter);
app.use("/stream", streamRouter);
app.use(errorHandler);

export const api = functions.https.onRequest(app);
