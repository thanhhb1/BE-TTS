import express from 'express';
import {
  getBrands,
  createBrand,
  updateBrand,
  getDeletedBrands,
  removeBrand,
  restoreBrand,
  forceDeleteBrand
} from '../controllers/brand.js';
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
const routerBrand = express.Router();

routerBrand.get('/',authenticate, authorizeRoles("admin", "manage"), getBrands); 
routerBrand.get('/trash',authenticate, authorizeRoles("admin"), getDeletedBrands); 
routerBrand.post('/',authenticate, authorizeRoles("admin", "manage"), createBrand);
routerBrand.put('/:id',authenticate, authorizeRoles("admin", "manage"), updateBrand);
routerBrand.delete('/:id',authenticate, authorizeRoles("admin"), removeBrand);
routerBrand.patch('/restore/:id',authenticate, authorizeRoles("admin"), restoreBrand);
routerBrand.delete('/forcedelete/:id',authenticate, authorizeRoles("admin"), forceDeleteBrand); 

export default routerBrand;
