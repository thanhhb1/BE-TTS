import express from 'express';
import routerCategory from './category.js'; 
import routerProduct from './product.js';
// import routerAuth from './auth.js';

const router = express.Router();


router.use('/categories', routerCategory);
router.use('/products', routerProduct);



export default router;
