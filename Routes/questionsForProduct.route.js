import express from "express";
import { addQuestion, deleteQuestion, getAllQuestion, getQuestion, updateQuestion } from "../Controller/questionsForProduct.controller.js";
const questionsForProductRouter = express.Router();

questionsForProductRouter.route('/')
    .post(addQuestion)
    .get(getAllQuestion)

questionsForProductRouter.route("/:id")
    .get(getQuestion)
    .patch(updateQuestion)
    .delete(deleteQuestion)


export default questionsForProductRouter;