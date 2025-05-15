import express from "express";
import {
  getAll,
  
} from "../controllers/category.js";

const routerCategory = express.Router();

routerCategory.get("/", getAll);



export default routerCategory;
