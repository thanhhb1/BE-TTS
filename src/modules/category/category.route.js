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
  
  
} from "./category.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.js";
const routerCategory = express.Router();

routerCategory.get("/",authenticate, authorizeRoles("admin", "manage"), getCategories);
routerCategory.get("/trash",authenticate, authorizeRoles("admin"), getDeletedCategories);
routerCategory.get("/:id",authenticate, authorizeRoles("admin", "manage"),getCategoryById);
routerCategory.post("/",authenticate, authorizeRoles("admin", "manage"), createCategory);
routerCategory.put("/:id",authenticate, authorizeRoles("admin", "manage"), updateCategory);
routerCategory.delete("/:id",authenticate, authorizeRoles("admin"), removeCategory); 
routerCategory.patch("/restore/:id",authenticate, authorizeRoles("admin"), restoreCategory); // khôi phục
routerCategory.delete("/forcedelete/:id",authenticate, authorizeRoles("admin"), forceDeleteCategory); // xóa vĩnh viễn


export default routerCategory;
