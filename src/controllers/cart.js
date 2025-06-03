import Cart from '../models/Cart.js';

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
