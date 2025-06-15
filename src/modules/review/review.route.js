import express from "express";
import { 
    getReviews,
    getReviewById,
    updateReview,
    removeReview,
    restoreReview,
    getDeletedReviews
 } from "./review.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.js";
const routerReview = express.Router();

routerReview.get("/",authenticate, authorizeRoles("admin", "manage"), getReviews);
routerReview.get("/:id",authenticate, authorizeRoles("admin", "manage"), getReviewById);
routerReview.patch("/:id",authenticate, authorizeRoles("admin", "manage"), updateReview);
routerReview.delete("/:id",authenticate, authorizeRoles("admin"),removeReview);
routerReview.patch("/restore/:id",authenticate, authorizeRoles("admin"), restoreReview);
routerReview.get("/trash",authenticate, authorizeRoles("admin"), getDeletedReviews);

export default routerReview;
