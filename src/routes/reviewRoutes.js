import express from "express";
import { calcRating, createReview, getReviewOfOneProducts } from "../controller/product/reviewsController.js";
import { protect } from "../controller/guard/protect.js";

export const reviewRouter = express.Router();

reviewRouter.post("/create", protect, createReview, calcRating);
reviewRouter.get("/:id", getReviewOfOneProducts);
