import express from "express";
import { GetMall, LoginUser, UpdateUser, addSurvey,  deleteSurvey,  updateSurvey } from "../Controller/survey.controller.js";
const surveyRouter = express.Router();

surveyRouter.route("/").get(GetMall).post(addSurvey);

surveyRouter.route("/:id").patch(updateSurvey).delete(deleteSurvey);
surveyRouter.route("/login").post(LoginUser);

export default surveyRouter;
