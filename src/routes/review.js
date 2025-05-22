import express from "express";
import { 
    getReviews,
    getReviewById,
    updateReview,
    removeReview,
    restoreReview,
    getDeletedReviews
 } from "../controllers/review.js";

const routerReview = express.Router();

routerReview.get("/", getReviews);
routerReview.get("/trash", getDeletedReviews);
routerReview.get("/:id", getReviewById);
routerReview.patch("/:id", updateReview);
routerReview.delete("/:id",removeReview);
routerReview.patch("/restore/:id", restoreReview);

export default routerReview;
