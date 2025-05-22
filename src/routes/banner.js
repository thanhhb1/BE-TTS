import express from "express";
import {
  getBanners,
  createBanner,
  updateBanner
  
} from "../controllers/banner.js";

const routerBanner = express.Router();

routerBanner.get("/",getBanners);
routerBanner.post("/",createBanner);
routerBanner.put("/:id",updateBanner);



export default routerBanner;
