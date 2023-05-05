import express from "express";

import { challengeRequest, challengeVerify } from "./authController";

export const authRouter = express.Router();

authRouter.post("/challenge/request", challengeRequest);
authRouter.post("/challenge/verify", challengeVerify);
