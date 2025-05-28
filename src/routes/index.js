import express from 'express';
import routerCategory from './category.js';
import routerUser from './user.js';
import routerProduct from './product.js';
import routerCoupon from './coupon.js';
import routerReview from './review.js';
import routerBanner from './banner.js';
import routerBrand from './brand.js';
import routerAuth from './auth.js';

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

export default router;
