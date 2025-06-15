import mongoose from 'mongoose';
import Product from './Product.model.js';
import { productSchema } from './product.validation.js';

export const getProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, isDeleted } = req.query;

    let filter = {};
    if (isDeleted === "true") {
      filter.isDeleted = true;
    } else {
      filter.isDeleted = false;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const totalItems = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category_id")
      .skip(skip)
      .limit(limitNumber);

    return res.success({
      products,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limitNumber),
        currentPage: pageNumber,
        pageSize: limitNumber,
      }
    }, "Lấy danh sách sản phẩm thành công");
  } catch (error) {
    return res.error("Lỗi server", 500);
  }
};

export const getDeletedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalItems = await Product.countDocuments({ isDeleted: true });

    const deletedProducts = await Product.find({ isDeleted: true })
      .skip(skip)
      .limit(limit)
      .populate("category_id");

    return res.success({
      data: deletedProducts,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
      }
    }, "Danh sách sản phẩm đã xóa mềm");
  } catch (error) {
    return res.error("Lỗi server", 500);
  }
};

export const getProductDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id, isDeleted: false }).populate('category_id');
    if (!product) {
      return res.error("Không tìm thấy sản phẩm", 404);
    }
    return res.success(product, "Lấy chi tiết sản phẩm thành công");
  } catch (error) {
    return res.error("Lỗi server", 500);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message, 400);
    }

    const existingProduct = await Product.findOne({ name: value.name });
    if (existingProduct) {
      return res.error("Tên sản phẩm đã tồn tại", 409);
    }

    const newProduct = new Product(value);
    await newProduct.save();

    return res.success(newProduct, "Tạo sản phẩm thành công", 201);
  } catch (error) {
    return res.error("Lỗi server", 500);
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
      return res.error("Không tìm thấy sản phẩm để cập nhật", 404);
    }
    return res.success(updatedProduct, "Cập nhật sản phẩm thành công");
  } catch (error) {
    return res.error("Lỗi server", 500);
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.error("Không tìm thấy sản phẩm để xoá", 404);
    }
    product.isDeleted = true;
    await product.save();
    return res.success(product, "Xoá sản phẩm thành công (xóa mềm)");
  } catch (error) {
    return res.error("Lỗi server", 500);
  }
};

export const restoreProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id, isDeleted: true });
    if (!product) {
      return res.error("Không tìm thấy sản phẩm để khôi phục", 404);
    }

    product.isDeleted = false;
    await product.save();

    return res.success(product, "Khôi phục sản phẩm thành công");
  } catch (error) {
    return res.error("Lỗi server", 500);
  }
};

export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.validation("categoryId không hợp lệ", 400);
  }
  try {
    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

    const products = await Product.find({
      category_id: categoryObjectId,
      isDeleted: false,
    }).populate("category_id");

    if (products.length === 0) {
      return res.error("Không có sản phẩm nào trong danh mục này", 404);
    }

    return res.success(products, "Lấy sản phẩm theo danh mục thành công");
  } catch (error) {
    return res.error("Lỗi server", 500);
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
      return res.error("Không tìm thấy sản phẩm trong thùng rác", 404);
    }

    await Product.deleteOne({ _id: product._id });

    return res.success(null, "Xóa vĩnh viễn sản phẩm thành công");
  } catch (error) {
    return res.error("Lỗi khi xóa sản phẩm", 500);
  }
};
