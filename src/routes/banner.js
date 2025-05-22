import express from "express";
import {
  getCategories,
  
  
  
} from "../controllers/category.js";

const routerBanner = express.Router();

routerBanner.get("/", getBanners);


export default routerBanner;
