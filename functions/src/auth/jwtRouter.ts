import express from 'express';
import {idTokenGenertor} from './jwtController';

export const jwtRouter = express.Router();

jwtRouter.post('/issue', idTokenGenertor);
