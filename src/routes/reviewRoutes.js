import express from "express";
import { calcRating, createReview } from "../controller/product/reviewsController.js";
import { protect } from "../controller/guard/protect.js";

export const reviewRouter = express.Router();

reviewRouter.post("/create", protect, createReview, calcRating);
