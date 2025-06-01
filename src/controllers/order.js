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

    let query = {};

    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: "i" }
      }, "_id");

      const userIds = users.map(user => user._id);

      query = {
        $or: [
          { invoice_number: { $regex: search, $options: "i" } },
          { user_id: { $in: userIds } }
        ]
      };
    }

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



export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user_id", "name email")
      .populate("coupon_id", "code discount")
      .populate("items.product_id", "name size price image")
      .populate("items.variant_id", "size price image");

    if (!order) {
      return res.success(null, "Không tìm thấy đơn hàng");
    }

    return res.success(order, "Lấy chi tiết đơn hàng thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const order = await Order.findById(id).populate("user_id", "name email");

    if (!order) {
      return res.success(null, "Đơn hàng không tồn tại");
    }

    if (order.order_status === "cancelled") {
      return res.success(null, "Không thể cập nhật đơn hàng đã bị hủy");
    }

    const validOrderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];
    const validPaymentStatuses = ["pending", "completed", "failed", "refunded", "canceled"];

    const isCancellingNow = order_status === "cancelled";


    if (payment_status && payment_status !== order.payment_status) {
      if (!validPaymentStatuses.includes(payment_status)) {
        return res.success(null, "Trạng thái thanh toán không hợp lệ");
      }

      if (order.order_status === "cancelled" || isCancellingNow) {
        if (order.payment_method === "cash_on_delivery") {
          return res.success(null, "Đơn hàng COD đã bị hủy, không thể thay đổi trạng thái thanh toán.");
        }
      }

      if (
        order.payment_method === "cash_on_delivery" &&
        payment_status === "completed" &&
        order.order_status !== "delivered" &&
        !isCancellingNow
      ) {
        return res.success(null, "COD chỉ được xác nhận thanh toán khi đơn đã được giao.");
      }

      if (order.payment_status === "completed" && payment_status !== "refunded") {
        return res.success(null, "Thanh toán đã hoàn tất. Không thể thay đổi nữa.");
      }

      if (
        order.payment_method === "cash_on_delivery" &&
        payment_status === "refunded" &&
        order.order_status !== "delivered"
      ) {
        return res.success(null, "Đơn hàng chưa được giao nên không thể hoàn tiền với phương thức COD.");
      }

      order.payment_status = payment_status;
    }


    if (order_status && order_status !== order.order_status) {
      if (!validOrderStatuses.includes(order_status)) {
        return res.success(null, "Trạng thái đơn hàng không hợp lệ");
      }

      const flow = ["pending", "processing", "shipped", "delivered"];
      const currentIndex = flow.indexOf(order.order_status);
      const newIndex = flow.indexOf(order_status);

      if (order_status === "cancelled") {
        if (order.order_status === "returned") {
          return res.success(null, "Đơn hàng đã hoàn trả, không thể hủy.");
        }
        if (currentIndex >= flow.indexOf("shipped")) {
          return res.success(null, "Đơn hàng đã giao cho ship không thể hủy.");
        }

        const onlineMethods = ["credit_card", "bank_transfer"];
        if (
          onlineMethods.includes(order.payment_method) &&
          order.payment_status === "completed"
        ) {
          order.payment_status = "refunded";
        }

        order.order_status = "cancelled";
      } else {
        if (order_status !== "returned" && newIndex < currentIndex) {
          return res.success(null, "Không thể cập nhật lùi trạng thái đơn hàng");
        }

        const onlineMethods = ["credit_card", "bank_transfer"];
        if (
          order_status !== "returned" &&
          onlineMethods.includes(order.payment_method) &&
          order.payment_status !== "completed"
        ) {
          return res.success(null, "Chưa hoàn tất thanh toán, không thể cập nhật đơn hàng");
        }

        if (
          order_status === "delivered" &&
          order.payment_method === "cash_on_delivery" &&
          order.payment_status !== "completed"
        ) {
          order.payment_status = "completed";
        }

        if (order_status === "returned") {
          if (order.payment_status === "completed") {
            order.payment_status = "refunded";
          } else {
            return res.success(null, "Chưa thanh toán. Không thể hoàn trả đơn hàng.");
          }
        }

        order.order_status = order_status;
      }
    }

    await order.save();

    return res.success(
      {
        order_status: order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        invoice_number: order.invoice_number,
        total_amount: order.total_amount,
        user: order.user_id,
      },
      "Cập nhật trạng thái thành công"
    );
  } catch (error) {
    return res.error(error.message);
  }
};
