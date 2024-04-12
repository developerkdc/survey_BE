import express from "express";
import {
  addMappingQuestions,
  deleteMappingQuestions,
  getMappingQuestions,
  mappedQuestionsList,
} from "../Controller/mappingQuestion.controller.js";
const mappingQuestionRouter = express.Router();

mappingQuestionRouter.route("/").post(addMappingQuestions);
mappingQuestionRouter.route("/mall/list").get(mappedQuestionsList);
mappingQuestionRouter.route('/:mallId').get(getMappingQuestions)
mappingQuestionRouter.route("/:mallId/:questionId").delete(deleteMappingQuestions);

export default mappingQuestionRouter;
