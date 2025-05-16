import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category_id');

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const getProductDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate('category_id');

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const {
    name,
    category_id,
    origin,
    description,
    images,
    size,
    fragrance,
    hair_type,
    stock_quantity,
    price,
    discount_price,
    variation_status,
  } = req.body;

  try {
    const newProduct = new Product({
      name,
      category_id,
      origin,
      description,
      images,
      size,
      fragrance,
      hair_type,
      stock_quantity,
      price,
      discount_price,
      variation_status,
    });

    await newProduct.save();

    return res.status(201).json({ message: "Tạo sản phẩm thành công", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

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
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để xoá" });
    }

    return res.status(200).json({ message: "Xoá sản phẩm thành công", product: deletedProduct });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
