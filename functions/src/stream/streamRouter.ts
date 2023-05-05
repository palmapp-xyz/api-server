import express from "express";

import { isAuthenticated } from "../middlewares/authHandler";
import {
  addAddr,
  create,
  del,
  getAll,
  getAllAddr,
  removeAddr,
  update,
} from "./streamController";

export const streamRouter = express.Router();
/**
 * @typedef {object} Stream
 * @property {string} webhookUrl - Webhook URL to send stream data on
 * @property {string} triggers - Triggers to listen for on blockchain
 *
 * */
/**
 * POST /stream/create
 * @summary Creates a new stream on Moralis server
 * @tags Stream
 * @param {Stream} request.body.required - Stream to be created
 * @return {object} 200 - Stream object
 * @security JWT
 */
streamRouter.route("/create").post(isAuthenticated, create);

/**
 * PUT /stream/update/:id
 * @summary Updates a stream on Moralis server
 * @tags Stream
 * @param {Stream} request.body.required - Stream to be updated
 * @param {string} id.params.required - Stream ID to be updated
 * @return {object} 200 - Stream object
 * @security JWT
 *
 */
streamRouter.route("/update/:id").put(isAuthenticated, update);
/**
 * GET /stream/getAll
 * @summary Gets all streams on Moralis server
 * @tags Stream
 * @return {object} 200 - Stream object
 *
 * */
streamRouter.route("/getAll").get(getAll);
/**
 * DELETE /stream/delete/:id
 * @summary Deletes a stream on Moralis server
 * @tags Stream
 * @param {string} id.params.required - Stream ID to be deleted
 * @return {object} 200 - Stream object
 *
 */
streamRouter.route("/delete/:id").delete(isAuthenticated, del);
/**
 * POST /stream/:id/add
 * @summary Adds an address to a stream
 * @tags Stream
 * @param {string} id.params.required - Stream ID where address is to be added
 * @param {string} request.body.address.required - Address to be added
 * @return {object} 200 - Stream object
 * @security JWT
 *
 */
streamRouter.route("/:id/add").post(isAuthenticated, addAddr);
/**
 * POST /stream/:id/remove
 * @summary Removes an address from a stream
 * @tags Stream
 * @param {string} id.params.required - Stream ID where address is to be removed
 * @param {string} request.body.address.required - Address to be removed
 * @return {object} 200 - Stream object
 * @security JWT
 */
streamRouter.route("/:id/remove").post(isAuthenticated, removeAddr);
/**
 * GET /stream/:id/list
 * @summary Gets all addresses from a stream
 * @tags Stream
 * @param {string} id.params.required - Stream ID where addresses are to be fetched
 * @return {object} 200 - Stream object
 *
 */
streamRouter.route("/:id/list").get(getAllAddr);
