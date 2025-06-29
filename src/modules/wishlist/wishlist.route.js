import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from './wishlist.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const routerWishlist = express.Router();

routerWishlist.get('/', authenticate, getWishlist);
routerWishlist.post('/', authenticate, addToWishlist);
routerWishlist.delete('/', authenticate, removeFromWishlist);

export default routerWishlist;