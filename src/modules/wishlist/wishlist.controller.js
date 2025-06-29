import Wishlist from './Wishlist.model.js';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const wishlist = await Wishlist.find({ user_id: userId })
      .populate('product_id', 'name images price discount_price origin')
      .sort({ createdAt: -1 });
    
    return res.success(wishlist, 'Lấy danh sách yêu thích thành công');
  } catch (error) {
    return res.error('Lỗi khi lấy danh sách yêu thích: ' + error.message);
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id } = req.body;
    
    if (!product_id) {
      return res.error('Thiếu thông tin sản phẩm', 400);
    }
    
    // Kiểm tra đã tồn tại chưa
    const existing = await Wishlist.findOne({ user_id: userId, product_id });
    if (existing) {
      return res.error('Sản phẩm đã có trong danh sách yêu thích', 400);
    }
    
    const wishlistItem = await Wishlist.create({ user_id: userId, product_id });
    const populatedItem = await Wishlist.findById(wishlistItem._id)
      .populate('product_id', 'name images price discount_price origin');
    
    return res.success(populatedItem, 'Thêm vào danh sách yêu thích thành công');
  } catch (error) {
    return res.error('Lỗi khi thêm vào danh sách yêu thích: ' + error.message);
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id } = req.body;
    
    if (!product_id) {
      return res.error('Thiếu thông tin sản phẩm', 400);
    }
    
    const deleted = await Wishlist.findOneAndDelete({ user_id: userId, product_id });
    if (!deleted) {
      return res.error('Không tìm thấy sản phẩm trong danh sách yêu thích', 404);
    }
    
    return res.success(null, 'Xóa khỏi danh sách yêu thích thành công');
  } catch (error) {
    return res.error('Lỗi khi xóa khỏi danh sách yêu thích: ' + error.message);
  }
};