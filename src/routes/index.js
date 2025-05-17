import express from 'express';
import adminRoutes from './admin/index.js';
// import clientRoutes from './client/index.js';  

const router = express.Router();

router.use('/admin', adminRoutes);
// router.use('/client', clientRoutes);

export default router;
