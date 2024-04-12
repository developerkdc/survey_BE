import express from "express";
import {
  addRatingAndReviews,
  addUser,
  getAllUserForQuestion,
  getRatingAndReviews,
  getRatingAndReviewsUser,
} from "../Controller/RatingAndReviews.controller.js";
import { MulterFunction } from "../Utils/MulterFunction.js";
const RatingAndReviewsRouter = express.Router();

RatingAndReviewsRouter.route("/").post( addRatingAndReviews).get(getRatingAndReviews);
RatingAndReviewsRouter.route("/getUserForQuestion").get(getAllUserForQuestion);

// RatingAndReviewsRouter.route("/addUser/:id").patch(MulterFunction("./public").fields([{ name: "bill_image", maxCount: 1 }]), addUser);
RatingAndReviewsRouter.route("/addUser/:id").patch(MulterFunction("./public"),  (req, res) =>
  addUser(req, res, req.cloudinaryUrl)
);

RatingAndReviewsRouter.get("/user", getRatingAndReviewsUser);

export default RatingAndReviewsRouter;
