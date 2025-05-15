import express from "express";
import {
  getCategories,
  getById,
  remove,
  restore,
  permanentlyRemove,
  
} from "../controllers/category.js";

const routerCategory = express.Router();

routerCategory.get("/", getCategories);
routerCategory.get("/:id", getById);


routerCategory.delete("/:id", remove); // soft delete
routerCategory.patch("/restore/:id", restore); // khôi phục
routerCategory.delete("/permanently/:id", permanentlyRemove); // xóa vĩnh viễn


export default routerCategory;
