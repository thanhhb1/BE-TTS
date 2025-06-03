import express from 'express';
import { getBanners, } from '../controllers/banner.js';
import { 
  getProductDetail,
  getProducts,
  getProductsByCategory,

} from "../controllers/product.js";
import {getCarts} from '../controllers/cart.js';
import { createUser, getUserDetail, getUsers, updateUser } from '../controllers/user.js';
import { getCategories, getCategoryById } from '../controllers/category.js';
import { authenticate} from "../middlewares/auth.js";
const routerClient = express.Router();

routerClient.get('/banners', getBanners); 
routerClient.get('/products', getProducts); 
routerClient.get('/products/:id', getProductDetail); 
routerClient.get('/users', getUsers); 
routerClient.get('/users/:id', getUserDetail); 
routerClient.post('/users', createUser); 
routerClient.put('/users/:id', updateUser); 

routerClient.get('/categories', getCategories); //Lấy tên danh mục
routerClient.get('/categories/:id', getCategoryById); //Lấy ID danh mục
routerClient.get('/products/by-category/:categoryId', getProductsByCategory);  //Lấy sản phẩm theo danh mục

routerClient.get('/carts',authenticate, getCarts); 

export default routerClient;
