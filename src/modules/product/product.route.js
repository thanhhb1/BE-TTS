import { 
  getProducts,
  getProductDetail,
  updateProduct,
  createProduct,
  deleteProduct,
  restoreProduct,
  getDeletedProducts,
  getProductsByCategory,
  forceDeleteProduct
} from "./product.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.js";
import { Router } from "express";

const routerProduct = Router();

routerProduct.get("/",authenticate, authorizeRoles("admin", "manage"), getProducts);
routerProduct.get("/deleted",authenticate, authorizeRoles("admin"), getDeletedProducts);  
routerProduct.get("/by-category/:categoryId",authenticate, authorizeRoles("admin", "manage"), getProductsByCategory); 
routerProduct.get("/:id",authenticate, authorizeRoles("admin", "manage"), getProductDetail);
routerProduct.post("/",authenticate, authorizeRoles("admin", "manage"), createProduct);
routerProduct.put("/:id",authenticate, authorizeRoles("admin", "manage"), updateProduct);
routerProduct.delete("/:id",authenticate, authorizeRoles("admin"), deleteProduct);
routerProduct.patch("/restore/:id",authenticate, authorizeRoles("admin"), restoreProduct); 
routerProduct.delete("/forcedelete/:id",authenticate, authorizeRoles("admin"), forceDeleteProduct); 

export default routerProduct;
