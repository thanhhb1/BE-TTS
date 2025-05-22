import express from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  removeBanner,
  restoreBanner,
  getDeletedBanners,
  forceDeleteBanner
} from '../controllers/banner.js';

const routerBanner = express.Router();

routerBanner.get('/', getBanners); 
routerBanner.get('/trash', getDeletedBanners); 
routerBanner.post('/', createBanner);
routerBanner.put('/:id', updateBanner);
routerBanner.delete('/:id', removeBanner);
routerBanner.patch('/restore/:id', restoreBanner); 
routerBanner.delete('/forcedelete/:id', forceDeleteBanner); 

export default routerBanner;
