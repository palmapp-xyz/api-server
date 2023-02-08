"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamRouter = void 0;
var express_1 = __importDefault(require("express"));
var streamController_1 = require("./streamController");
var authHandler_1 = require("../middlewares/authHandler");
exports.streamRouter = express_1.default.Router();
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
exports.streamRouter.route("/create").post(authHandler_1.isAuthenticated, streamController_1.create);
/**
 * PATCH /stream/update/:id
 * @summary Updates a stream on Moralis server
 * @tags Stream
 * @param {Stream} request.body.required - Stream to be updated
 * @param {string} id.params.required - Stream ID to be updated
 * @return {object} 200 - Stream object
 * @security JWT
 *
 */
exports.streamRouter.route("/update/:id").patch(authHandler_1.isAuthenticated, streamController_1.update);
/**
 * GET /stream/getAll
 * @summary Gets all streams on Moralis server
 * @tags Stream
 * @return {object} 200 - Stream object
 *
 * */
exports.streamRouter.route("/getAll").get(streamController_1.getAll);
/**
 * DELETE /stream/delete/:id
 * @summary Deletes a stream on Moralis server
 * @tags Stream
 * @param {string} id.params.required - Stream ID to be deleted
 * @return {object} 200 - Stream object
 *
 */
exports.streamRouter.route("/delete/:id").delete(authHandler_1.isAuthenticated, streamController_1.del);
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
exports.streamRouter.route("/:id/add").post(authHandler_1.isAuthenticated, streamController_1.addAddr);
/**
 * POST /stream/:id/remove
 * @summary Removes an address from a stream
 * @tags Stream
 * @param {string} id.params.required - Stream ID where address is to be removed
 * @param {string} request.body.address.required - Address to be removed
 * @return {object} 200 - Stream object
 * @security JWT
 */
exports.streamRouter.route("/:id/remove").post(authHandler_1.isAuthenticated, streamController_1.removeAddr);
/**
 * GET /stream/:id/list
 * @summary Gets all addresses from a stream
 * @tags Stream
 * @param {string} id.params.required - Stream ID where addresses are to be fetched
 * @return {object} 200 - Stream object
 *
 */
exports.streamRouter.route("/:id/list").get(streamController_1.getAllAddr);
