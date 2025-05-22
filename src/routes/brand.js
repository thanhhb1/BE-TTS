import express from 'express';
import {
  getBrands,
  createBrand,
  updateBrand,
  
} from '../controllers/brand.js';

const routerBrand = express.Router();

routerBrand.get('/', getBrands); 
// routerBrand.get('/trash', getDeletedBrands); 
routerBrand.post('/', createBrand);
routerBrand.put('/:id', updateBrand);
// routerBrand.patch('/:id', removeBrand);
// routerBrand.patch('/restore/:id', restoreBrand); 
// routerBrand.delete('/forcedelete/:id', forceDeleteBrand); 

export default routerBrand;
