import express from "express";
import {
  create, update, getAll, del, addAddr, removeAddr, getAllAddr,
} from "./streamController";
import {isAuthenticated} from "../middlewares/authHandler";

// eslint-disable-next-line new-cap
export const streamRouter = express.Router();

streamRouter.route("/create").post(isAuthenticated, create);
streamRouter.route("/update/:id").patch(isAuthenticated, update);
streamRouter.route("/getAll").get(getAll);
streamRouter.route("/delete/:id").delete(isAuthenticated, del);

streamRouter.route("/:id/add").post(isAuthenticated, addAddr);
streamRouter.route("/:id/remove").post(isAuthenticated, removeAddr);
streamRouter.route("/:id/list").get(getAllAddr);
