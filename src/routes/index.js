import express from 'express';
import routerCategory from './category.js'; 
import routerAuth from './auth.js';

const router = express.Router();


router.use('/categories', routerCategory);
router.use('/auth', routerAuth);



export default router;
