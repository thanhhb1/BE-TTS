import express from "express";
import {
  getCoupons,
  
} from "../controllers/coupon.js";

const routerCoupon = express.Router();

routerCoupon.get("/", getCoupons);                     
 

export default routerCoupon;
