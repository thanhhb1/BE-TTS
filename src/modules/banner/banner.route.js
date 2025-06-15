import express from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  removeBanner,
  restoreBanner,
  getDeletedBanners,
  forceDeleteBanner
} from './banner.controller.js';
import { authenticate, authorizeRoles } from "../../middlewares/auth.js";
const routerBanner = express.Router();

routerBanner.get('/',authenticate, authorizeRoles("admin", "manage"), getBanners); 
routerBanner.get('/trash',authenticate, authorizeRoles("admin"), getDeletedBanners); 
routerBanner.post('/',authenticate, authorizeRoles("admin", "manage"), createBanner);
routerBanner.put('/:id',authenticate, authorizeRoles("admin", "manage"), updateBanner);
routerBanner.delete('/:id',authenticate, authorizeRoles("admin"), removeBanner);
routerBanner.patch('/restore/:id',authenticate, authorizeRoles("admin"), restoreBanner); 
routerBanner.delete('/forcedelete/:id',authenticate, authorizeRoles("admin"), forceDeleteBanner); 

export default routerBanner;
