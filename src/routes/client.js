import express from 'express';
import { getBanners } from '../modules/banner/banner.controller.js';
import { 
  getProductDetail,
  getProducts,
  getProductsByCategory,

} from "../modules/product/product.controller.js";
import {addToCart, getCarts,updateCartItem,removeCarts ,removeCartItem} from '../modules/cart/cart.controller.js';
import { createUser, getUserDetail, getUsers, updateUser } from '../modules/user/user.controller.js';
import { getCategories, getCategoryById } from '../modules/category/category.controller.js';
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
import { getProductVariants, getVariantById } from '../modules/productVariant/productvariant.controller.js';
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


routerClient.get('/carts', authenticate, getCarts); 
routerClient.post('/carts', authenticate, addToCart);
routerClient.put('/carts', authenticate, updateCartItem); 
routerClient.delete('/carts', authenticate, removeCarts);
routerClient.delete('/carts/item',authenticate, removeCartItem);

routerClient.get('/productvariant/:id', getVariantById);


export default routerClient;
