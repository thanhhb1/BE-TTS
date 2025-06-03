import Cart from '../models/Cart.js';
import ProductVariant from "../models/ProductVariant.js";
import Product from "../models/Product.js";

export const getCarts = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user_id: userId })
      .populate('items.product_id')
      .populate('items.variation_id');

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
    const { product_id, variant_id, quantity } = req.body;

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

      price = product.price;
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
