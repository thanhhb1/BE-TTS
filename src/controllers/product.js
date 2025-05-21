import Product from '../models/Product.js';
import { productSchema } from '../validation/product.js';

export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = { isDeleted: false };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).populate("category_id");

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


export const getDeletedProducts = async (req, res) => {
  try {
    const deletedProducts = await Product.find({ isDeleted: true }).populate("category_id");

    if (!deletedProducts || deletedProducts.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào đã xóa mềm" });
    }

    return res.status(200).json({
      success: true,
      message: "Danh sách sản phẩm đã xóa mềm",
      data: deletedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};


export const getProductDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id, isDeleted: false }).populate('category_id');
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Kiểm tra tên sản phẩm đã tồn tại chưa
    const existingProduct = await Product.findOne({ name: value.name });
    if (existingProduct) {
      return res.status(409).json({ message: "Tên sản phẩm đã tồn tại" }); 
    }

    const newProduct = new Product(value);
    await newProduct.save();

    return res.status(201).json({
      message: "Tạo sản phẩm thành công",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật" });
    }
    return res.status(200).json({ message: "Cập nhật sản phẩm thành công", product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để xoá" });
    }
    product.isDeleted = true;
    await product.save();
    return res.status(200).json({ message: "Xoá sản phẩm thành công (xóa mềm)", product });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const restoreProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id, isDeleted: true });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để khôi phục" });
    }

    product.isDeleted = false;
    await product.save();

    return res.status(200).json({ message: "Khôi phục sản phẩm thành công", product });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ 
      category_id: categoryId, 
      isDeleted: false 
    }).populate('category_id');

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có sản phẩm nào trong danh mục này",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy sản phẩm theo danh mục thành công",
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};


// Xóa vĩnh viễn sản phẩm
export const forceDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong thùng rác" });
    }

    await Product.deleteOne({ _id: product._id });

    return res.status(200).json({ message: "Xóa vĩnh viễn sản phẩm thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
  }
};
