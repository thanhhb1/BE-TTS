import express from 'express';
import routerCategory from '../modules/category/category.route.js';
import routerUser from '../modules/user/user.route.js';
import routerProduct from '../modules/product/product.route.js';
import routerCoupon from '../modules/coupon/coupon.route.js';
import routerReview from '../modules/review/review.route.js';
import routerBanner from '../modules/banner/banner.route.js';
import routerBrand from '../modules/brand/brand.route.js';
import routerOrder from '../modules/order/order.route.js';
import routerAuth from '../modules/user/auth.route.js';
import routerClient  from './client.js';


import { authenticate, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use('/auth', routerAuth);


router.use('/admin/categories',authenticate, authorizeRoles('admin','manage') ,routerCategory);
router.use('/admin/users',authenticate, authorizeRoles('admin','manage') , routerUser);
router.use('/admin/products',authenticate, authorizeRoles('admin','manage') , routerProduct);
router.use('/admin/coupons', authenticate, authorizeRoles('admin','manage') ,routerCoupon);
router.use('/admin/reviews',authenticate, authorizeRoles('admin','manage') , routerReview);
router.use('/admin/banners',authenticate, authorizeRoles('admin','manage') , routerBanner);
router.use('/admin/brands', authenticate, authorizeRoles('admin','manage') ,routerBrand);
router.use('/admin/orders', authenticate, authorizeRoles('admin','manage') ,routerOrder);
router.use('/client', routerClient);



export default router;
