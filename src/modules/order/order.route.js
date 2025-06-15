import express from "express";
import {
  getOrderById,
  getOrders,
  updateOrderStatus,
  
  
} from "./order.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.js";
const routerOrder = express.Router();

routerOrder.get("/",authenticate, authorizeRoles("admin", "manage"), getOrders);
routerOrder.get("/:id",authenticate, authorizeRoles("admin", "manage"), getOrderById);
routerOrder.patch("/:id",authenticate, authorizeRoles("admin", "manage"), updateOrderStatus);

export default routerOrder;
