import express from "express";
import { 
    getReviews,
    getReviewById
 } from "../controllers/review.js";

const routerReview = express.Router();

routerReview.get("/", getReviews);
routerCoupon.get("/:id", getReviewById);

export default routerReview;
