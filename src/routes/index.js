import express from 'express';
import routerCategory from './category.js'; 
import routerUser from './user.js';  
import routerProduct from './product.js';
import routerCoupon from './coupon.js';
import routerReview from './review.js';
import routerBanner from './banner.js';
import routerBrand from './brand.js';



// import routerAuth from './auth.js';

const router = express.Router();


router.use('/categories', routerCategory);
router.use('/users', routerUser);
router.use('/products', routerProduct);
router.use('/coupons', routerCoupon);
router.use('/reviews', routerReview);
router.use('/banners', routerBanner);
router.use('/brands', routerBrand);








// router.use('/auth', routerAuth);



export default router;
