import express from 'express';
import {
  getBanners,
  
} from '../controllers/banner.js';
import { 
  getProducts,

} from "../controllers/product.js";

const routerClient = express.Router();

routerClient.get('/banners', getBanners); 
routerClient.get('/products', getProducts); 


export default routerClient;
