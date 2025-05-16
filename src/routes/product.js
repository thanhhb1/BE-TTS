import { Router } from "express";
import {
  getProducts,
  getProductDetail,
  updateProduct,
  createProduct,
  deleteProduct,
} from "../controllers/product.js";

const routerProduct = Router();

routerProduct.get("/", getProducts);
routerProduct.get("/:id", getProductDetail);
routerProduct.post("/", createProduct);
routerProduct.put("/:id", updateProduct);
routerProduct.delete("/:id", deleteProduct);

export default routerProduct;