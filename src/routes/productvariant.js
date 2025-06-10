import { createVariant, deleteVariant, forceDeleteVariant, getDeletedVariants, getProductVariants, getVariantById, restoreVariant, updateVariant } from "../controllers/productvariant.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
import { Router } from "express";

const routerProduct = Router();

routerProduct.get("/",authenticate, authorizeRoles("admin", "manage"), getProductVariants);
routerProduct.get("/deleted",authenticate, authorizeRoles("admin"), getDeletedVariants);  
routerProduct.get("/:id",authenticate, authorizeRoles("admin", "manage"), getVariantById);
routerProduct.post("/",authenticate, authorizeRoles("admin", "manage"), createVariant);
routerProduct.put("/:id",authenticate, authorizeRoles("admin", "manage"), updateVariant);
routerProduct.delete("/:id",authenticate, authorizeRoles("admin"), deleteVariant);
routerProduct.patch("/restore/:id",authenticate, authorizeRoles("admin"), restoreVariant); 
routerProduct.delete("/forcedelete/:id",authenticate, authorizeRoles("admin"), forceDeleteVariant); 

export default routerProduct;
