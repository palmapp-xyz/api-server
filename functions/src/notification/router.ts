// express Router
import { Router } from "express";

import { sendNotification } from "./controller";

export const notificationRouter = Router();
/**
 * @typedef {object} Notification
 * @property {string} message.required - message to send - eg: 'Hello World!'
 * @property {string[]} tokens.required - tokens of the users to send notification to - eg '123456789'
 *
 */

/**
 * POST /notification/send
 * @summary Send notification to user
 * @tags Notification
 * @param {Notification} request.body.required - notification to send
 * @return {object} 200 - An object of notification result
 * @return {Error}  default - Unexpected error
 * @security JWT
 *
 */
notificationRouter.post("/send", /** isAuthenticated, */ sendNotification);
