import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import RatingAndReviewsRouter from "./Routes/RatingAndReviews.routes.js";
import questionsForProductRouter from "./Routes/questionsForProduct.route.js";
import mappingQuestionRouter from "./Routes/mappingQuestion.routes.js";
import cors from "cors";
import graphRouter from "./Routes/graph.route.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import surveyRouter from "./Routes/survey.route.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 8001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Database is connected"))
  .catch(() => console.log("Database is disconnected"));

  var corsOptions = {
    // origin: ["http://localhost:3001","https://feedback.kdcstaging.in"],
    origin: "*",
    optionsSuccessStatus: 200,
    credentials: true,
  }

app.use(cors(corsOptions));
app.use("/public", express.static("./public"));
app.use(express.static(__dirname));
app.use(express.json());

app.use("/RatingAndReviews", RatingAndReviewsRouter);
app.use("/questions", questionsForProductRouter);
app.use("/survey", surveyRouter);
app.use("/mappingQuestion", mappingQuestionRouter);
app.use("/graph", graphRouter);

app.listen(port, () => {
  console.log(`app is listening at ${port}`);
});
