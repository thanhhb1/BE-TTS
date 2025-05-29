import mongoose from "mongoose";
import Order from "../models/Order.js";
import ProductVariant from "../models/ProductVariant.js";


export const getOrders = async (req, res) => {
  try {
    const {
      _limit = 10,
      _page = 1,
      _sort = "createdAt",
      _order = "desc",
      search = ""
    } = req.query;

    const limit = parseInt(_limit);
    const page = parseInt(_page);
    const sortField = _sort;
    const sortOrder = _order === "asc" ? 1 : -1;

    let userIds = [];
    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: "i" }
      }, "_id");
      userIds = users.map(user => user._id);
    }

    
    const query = {
      $or: [
        { invoice_number: { $regex: search, $options: "i" } },
        { user_id: { $in: userIds } }
      ]
    };

    
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user_id", "name email");

    return res.success({
      total,
      currPage: page,
      limit,
      data: orders,
      hasMore: page * limit < total
    }, "Lấy danh sách đơn hàng thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.success(null, "OrderId không hợp lệ");
    }

    const order = await Order.findById(id)
      .populate("user_id", "fullname email phone addresses")
      .populate("items.product_id", "name price image")
      .populate("items.variant_id", "size price image");

    if (!order) {
      return res.success(null, "Không tìm thấy đơn hàng");
    }

    const shippingAddress = order.user_id?.addresses?.find(
      (addr) => addr._id.toString() === order.shipping_address_id.toString()
    );

    return res.success({
      id: order._id,
      user: order.user_id,
      payment_method: order.payment_method_id,
      order_status: order.order_status,
      total_amount: order.total_amount,
      invoice_number: order.invoice_number,
      items: order.items,
      shipping_address: shippingAddress || null,
    }, "Lấy chi tiết đơn hàng thành công");

  } catch (error) {
    return res.error(error.message);
  }
};
