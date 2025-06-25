import { createVariant, deleteVariant, forceDeleteVariant, getDeletedVariants, getProductVariants, getVariantById, restoreVariant, updateVariant } from "./productvariant.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.js";
import { Router } from "express";

const routerProductVariant = Router();

routerProductVariant.get("/",authenticate, authorizeRoles("admin", "manage"), getProductVariants);
routerProductVariant.get("/deleted",authenticate, authorizeRoles("admin"), getDeletedVariants);  
routerProductVariant.get("/:id",authenticate, authorizeRoles("admin", "manage"), getVariantById);
routerProductVariant.post("/",authenticate, authorizeRoles("admin", "manage"), createVariant);
routerProductVariant.put("/:id",authenticate, authorizeRoles("admin", "manage"), updateVariant);
routerProductVariant.delete("/:id",authenticate, authorizeRoles("admin"), deleteVariant);
routerProductVariant.patch("/restore/:id",authenticate, authorizeRoles("admin"), restoreVariant); 
routerProductVariant.delete("/forcedelete/:id",authenticate, authorizeRoles("admin"), forceDeleteVariant); 

export default routerProductVariant;
