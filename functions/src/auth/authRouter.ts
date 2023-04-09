import express from 'express';
import {idTokenGenertor} from './authController';

export const authRouter = express.Router();

authRouter.post('/issue', idTokenGenertor);
