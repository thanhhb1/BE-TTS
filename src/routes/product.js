import { 
  getProducts,
  getProductDetail,
  updateProduct,
  createProduct,
  deleteProduct,
  restoreProduct,
  getDeletedProducts,
  getProductsByCategory,
  forceDeleteProduct
} from "../controllers/product.js";

import { Router } from "express";

const routerProduct = Router();

routerProduct.get("/", getProducts);
routerProduct.get("/deleted", getDeletedProducts);  // xem các sản phẩm đã xóa mềm 
routerProduct.get("/by-category/:categoryId", getProductsByCategory); // lấy sản phẩm theo danh mục
routerProduct.get("/:id", getProductDetail);
routerProduct.post("/", createProduct);
routerProduct.put("/:id", updateProduct);
routerProduct.delete("/:id", deleteProduct);
routerProduct.patch("/restore/:id", restoreProduct); 
routerProduct.delete("/forcedelete/:id", forceDeleteProduct); 

export default routerProduct;
