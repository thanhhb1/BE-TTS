import express from "express";
import {
  getCoupons,
  getCouponById,
  removeCoupon,
  createCoupon,
  updateCoupon,
  getDeletedCoupons,
  restoreCoupon,
  forceDeleteCoupon
  
} from "../controllers/coupon.js";

const routerCoupon = express.Router();

routerCoupon.get("/", getCoupons);
routerCoupon.get("/trash", getDeletedCoupons);
routerCoupon.get("/:id", getCouponById);                      
routerCoupon.delete("/:id", removeCoupon);
routerCoupon.post("/", createCoupon);
routerCoupon.put("/:id",updateCoupon);
routerCoupon.patch("/restore/:id",restoreCoupon);
routerCoupon.delete("/forcedelete/:id",forceDeleteCoupon);

export default routerCoupon;
