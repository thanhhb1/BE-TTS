import express from 'express';
import { getBanners, } from '../controllers/banner.js';
import { 
  getProductDetail,
  getProducts,
  getProductsByCategory,

} from "../controllers/product.js";
import {addToCart, getCarts,updateCartItem,removeCarts ,removeCartItem} from '../controllers/cart.js';
import { createUser, getUserDetail, getUsers, updateUser } from '../controllers/user.js';
import { getCategories, getCategoryById } from '../controllers/category.js';
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
import { getProductVariants, getVariantById } from '../controllers/productvariant.js';
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

routerClient.get('/carts', authenticate, authorizeRoles("user"), getCarts); 
routerClient.post('/carts', authenticate, authorizeRoles("user"), addToCart);
routerClient.put('/carts', authenticate, authorizeRoles("user"), updateCartItem); 
routerClient.delete('/carts', authenticate, authorizeRoles("user"), removeCarts);

routerClient.get('/carts', authenticate, authorizeRoles("user"), getCarts); 
routerClient.post('/carts', authenticate, authorizeRoles("user"), addToCart);
routerClient.put('/carts', authenticate, authorizeRoles("user"), updateCartItem); 
routerClient.delete('/carts', authenticate, authorizeRoles("user"), removeCarts);
routerClient.delete('/carts/item',authenticate, authorizeRoles("user"), removeCartItem);

routerClient.get('/productvariant', authenticate, authorizeRoles("user"), getProductVariants); 
routerClient.get('/productvariant/:id', authenticate, authorizeRoles("user"), getVariantById);


export default routerClient;
