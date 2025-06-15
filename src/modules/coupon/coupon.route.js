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
  
} from "./coupon.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.js";
const routerCoupon = express.Router();

routerCoupon.get("/",authenticate, authorizeRoles("admin", "manage"), getCoupons);
routerCoupon.get("/trash",authenticate, authorizeRoles("admin"), getDeletedCoupons);
routerCoupon.get("/:id",authenticate, authorizeRoles("admin", "manage"), getCouponById);                      
routerCoupon.delete("/:id",authenticate, authorizeRoles("admin"), removeCoupon);
routerCoupon.post("/",authenticate, authorizeRoles("admin", "manage"), createCoupon);
routerCoupon.put("/:id",authenticate, authorizeRoles("admin", "manage"),updateCoupon);
routerCoupon.patch("/restore/:id",authenticate, authorizeRoles("admin"),restoreCoupon);
routerCoupon.delete("/forcedelete/:id",authenticate, authorizeRoles("admin"),forceDeleteCoupon);

export default routerCoupon;
