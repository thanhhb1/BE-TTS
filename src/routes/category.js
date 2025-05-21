import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  removeCategory,
  getDeletedCategories,
  restoreCategory,
  forceDeleteCategory,
  
  
} from "../controllers/category.js";

const routerCategory = express.Router();

routerCategory.get("/", getCategories);
routerCategory.get("/trash", getDeletedCategories);
routerCategory.get("/:id",getCategoryById);
routerCategory.post("/", createCategory);
routerCategory.put("/:id", updateCategory);
routerCategory.delete("/:id", removeCategory); 
routerCategory.patch("/restore/:id", restoreCategory); // khôi phục
routerCategory.delete("/forcedelete/:id", forceDeleteCategory); // xóa vĩnh viễn


export default routerCategory;
