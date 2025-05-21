import express from "express";
import {
  getCoupons,
  getCouponById,
  removeCoupon
  
} from "../controllers/coupon.js";

const routerCoupon = express.Router();

routerCoupon.get("/", getCoupons);
routerCoupon.get("/:id", getCouponById);                      
routerCoupon.delete("/:id", removeCoupon);

export default routerCoupon;
