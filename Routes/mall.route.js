import express from "express";
import { GetMall, LoginUser, UpdateUser, addMall, deleteMall, getMall, updateMall } from "../Controller/mall.controller.js";
const mallRouter = express.Router();

mallRouter.route("/").get(GetMall).post(addMall);

mallRouter.route("/:id").patch(UpdateUser).delete(deleteMall);
mallRouter.route("/login").post(LoginUser);

export default mallRouter;
