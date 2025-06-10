import Cart from '../models/Cart.js';
import ProductVariant from "../models/ProductVariant.js";
import Product from "../models/Product.js";

export const getCarts = async (req, res) => {
  try {
    const userId = req.user._id;


    const cart = await Cart.findOne({ user_id: userId })
      .populate('items.product_id')
      .populate('items.variant_id');

    if (!cart) {
      return res.success([], 'Giỏ hàng trống');
    }

    return res.success(cart, 'Lấy giỏ hàng thành công');
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    return res.error('Lỗi server khi lấy giỏ hàng');
  }
};



export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let { product_id, variant_id, quantity } = req.body;
    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    }
    let price = 0;
    let subtotal = 0;


    if (variant_id) {
      const variant = await ProductVariant.findById(variant_id);
      if (!variant) return res.error("Biến thể không tồn tại");

      price = variant.price;
    }

    else {
      const product = await Product.findById(product_id);
      if (!product) return res.error("Sản phẩm không tồn tại");

      price = product.discount_price;
    }

    subtotal = price * quantity;

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {

      cart = await Cart.create({
        user_id: userId,
        items: [{
          product_id,
          variant_id: variant_id || null,
          quantity,
          subtotal
        }]
      });

      return res.success(cart, "Đã tạo giỏ hàng mới và thêm sản phẩm");
    } else {

      const index = cart.items.findIndex(item =>
        item.product_id.toString() === product_id &&
        ((variant_id && item.variant_id?.toString() === variant_id) ||
          (!variant_id && !item.variant_id))
      );

      if (index !== -1) {

        cart.items[index].quantity += quantity;
        cart.items[index].subtotal = cart.items[index].quantity * price;
      } else {

        cart.items.push({
          product_id,
          variant_id: variant_id || null,
          quantity,
          subtotal
        });
      }

      await cart.save();
      return res.success(cart, "Đã cập nhật giỏ hàng thành công");
    }

  } catch (error) {
    console.error(error);
    return res.error("Lỗi khi thêm sản phẩm vào giỏ hàng", error.message);
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id, variant_id, quantity } = req.body;

    if (quantity < 1) {
      return res.error("Số lượng tối thiểu là 1. Nếu muốn xoá, hãy dùng nút xoá.");
    }

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.error("Giỏ hàng không tồn tại");

    const item = cart.items.find(item =>
      item.product_id.toString() === product_id &&
      ((variant_id && item.variant_id?.toString() === variant_id) ||
        (!variant_id && !item.variant_id))
    );

    if (!item) return res.error("Sản phẩm không có trong giỏ");

    const variant = variant_id
      ? await ProductVariant.findById(variant_id)
      : await Product.findById(product_id);

    const price = variant.price;

    item.quantity = quantity;
    item.subtotal = quantity * price;

    await cart.save();

    return res.success(cart, "Cập nhật số lượng thành công");
  } catch (err) {
    console.error(err);
    return res.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng");
  }
};
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id, variant_id } = req.body;

    if (!product_id) {
      return res.validation("Thiếu product_id");
    }

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.error("Không tìm thấy giỏ hàng", 404);
    }

    const beforeCount = cart.items.length;

    cart.items = cart.items.filter(item => {
      const productIdMatch = item.product_id.toString() !== product_id;
      const variantIdMatch =
        (variant_id && item.variant_id?.toString() !== variant_id) ||
        (!variant_id && item.variant_id); 
      return productIdMatch || variantIdMatch;
    });

    if (cart.items.length === beforeCount) {
      return res.error("Không tìm thấy sản phẩm cần xoá trong giỏ hàng", 404);
    }

    await cart.save();
    return res.success(cart, "Xoá sản phẩm khỏi giỏ hàng thành công");
  } catch (error) {
    console.error(error);
    return res.error("Lỗi khi xoá sản phẩm khỏi giỏ hàng");
  }
};

export const removeCarts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.validation("Danh sách sản phẩm cần xoá không hợp lệ");
    }

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.error("Không tìm thấy giỏ hàng", 404);
    }

    cart.items = cart.items.filter(item => {
      return !items.some(x => {
        const productIdMatch = item.product_id.toString() === x.product_id;
        const variantIdMatch = (x.variant_id && item.variant_id?.toString() === x.variant_id) || (!x.variant_id && !item.variant_id);
        return productIdMatch && variantIdMatch;
      });
    });

    await cart.save();

    return res.success(cart, "Đã xoá các sản phẩm đã chọn khỏi giỏ hàng");
  } catch (error) {
    console.error(error);
    return res.error("Lỗi khi xoá nhiều sản phẩm khỏi giỏ hàng");
  }
};
