import express from 'express';
import routerCategory from './category.js'; 
import routerUser from './user.js';  
import routerProduct from './product.js';
// import routerAuth from './auth.js';

const router = express.Router();


router.use('/categories', routerCategory);
router.use('/users', routerUser);
router.use('/products', routerProduct);

// import routerAuth from './auth.js';


// router.use('/auth', routerAuth);



export default router;
