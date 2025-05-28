import express from "express";
import {
  getOrders,
  
  
} from "../controllers/order.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
const routerOrder = express.Router();

routerOrder.get("/",authenticate, authorizeRoles("admin", "manage"), getOrders);


export default routerOrder;
