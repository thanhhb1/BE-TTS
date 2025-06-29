import mongoose from "mongoose";
import Order from "./Order.model.js";
import { createVnpayUrl } from "../../utils/vnpay.js";
import crypto from "crypto";
import qs from "qs"
import User from '../user/User.model.js';



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
      .populate("user_id", "fullname email")
      .populate("coupon_id", "code discount")
      .populate("items.product_id", "name size price image")
      .populate("items.variant_id", "size price image");

    if (!order) {
      return res.error("Không tìm thấy đơn hàng", 404);
    }

    return res.success(order, "Lấy chi tiết đơn hàng thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      _limit = 10,
      _page = 1,
      _sort = "createdAt",
      _order = "desc"
    } = req.query;

    const limit = parseInt(_limit);
    const page = parseInt(_page);
    const sortOrder = _order === "asc" ? 1 : -1;

    const total = await Order.countDocuments({ user_id: userId });
    const orders = await Order.find({ user_id: userId })
      .sort({ [_sort]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("items.product_id", "name images")
      .populate("items.variant_id", "size price");

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

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const order = await Order.findById(id).populate("user_id", "name email");

    if (!order) {
      return res.error("Đơn hàng không tồn tại", 404);
    }

    if (order.order_status === "cancelled") {
      return res.error("Không thể cập nhật đơn hàng đã bị hủy", 400);
    }

    const validOrderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];
    const validPaymentStatuses = ["pending", "completed", "failed", "refunded", "canceled"];

    const isCancellingNow = order_status === "cancelled";

    if (payment_status && payment_status !== order.payment_status) {
      if (!validPaymentStatuses.includes(payment_status)) {
        return res.error("Trạng thái thanh toán không hợp lệ", 400);
      }

      if (order.order_status === "cancelled" || isCancellingNow) {
        if (order.payment_method === "cash_on_delivery") {
          return res.error("Đơn hàng COD đã bị hủy, không thể thay đổi trạng thái thanh toán.", 400);
        }
      }

      if (
        order.payment_method === "cash_on_delivery" &&
        payment_status === "completed" &&
        order.order_status !== "delivered" &&
        !isCancellingNow
      ) {
        return res.error("COD chỉ được xác nhận thanh toán khi đơn đã được giao.", 400);
      }

      if (order.payment_status === "completed" && payment_status !== "refunded") {
        return res.error("Thanh toán đã hoàn tất. Không thể thay đổi nữa.", 400);
      }

      if (
        order.payment_method === "cash_on_delivery" &&
        payment_status === "refunded" &&
        order.order_status !== "delivered"
      ) {
        return res.error("Đơn hàng chưa được giao nên không thể hoàn tiền với phương thức COD.", 400);
      }

      order.payment_status = payment_status;
    }

    if (order_status && order_status !== order.order_status) {
      if (!validOrderStatuses.includes(order_status)) {
        return res.error("Trạng thái đơn hàng không hợp lệ", 400);
      }

      const flow = ["pending", "processing", "shipped", "delivered"];
      const currentIndex = flow.indexOf(order.order_status);
      const newIndex = flow.indexOf(order_status);

      if (order_status === "cancelled") {
        if (order.order_status === "returned") {
          return res.error("Đơn hàng đã hoàn trả, không thể hủy.", 400);
        }
        if (currentIndex >= flow.indexOf("shipped")) {
          return res.error("Đơn hàng đã giao cho ship không thể hủy.", 400);
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
          return res.error("Không thể cập nhật lùi trạng thái đơn hàng", 400);
        }

        const onlineMethods = ["credit_card", "bank_transfer"];
        if (
          order_status !== "returned" &&
          onlineMethods.includes(order.payment_method) &&
          order.payment_status !== "completed"
        ) {
          return res.error("Chưa hoàn tất thanh toán, không thể cập nhật đơn hàng", 400);
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
            return res.error("Chưa thanh toán. Không thể hoàn trả đơn hàng.", 400);
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




const generateInvoiceNumber = () => `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
export const createOrder = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { items, shipping_address, payment_method, coupon_id = null, bank_code, language = "vn" , shipping_fee = 0,} = req.body;

    if (!Array.isArray(items) || items.length === 0 || !shipping_address?.address || !payment_method) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu đơn hàng" });
    }

    const validMethods = ["cash_on_delivery", "vnpay"];
    if (!validMethods.includes(payment_method)) {
      return res.status(400).json({ success: false, message: "Phương thức thanh toán không hợp lệ" });
    }

    let total_amount = 0;
    const itemsWithTotal = items.map(item => {
      const total = item.price * item.quantity;
      total_amount += total;
      return {
        ...item,
        total_amount: total,
      };
    });

    total_amount += shipping_fee;

    let invoice_number = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let order = await Order.create({
      user_id,
      items: itemsWithTotal,
      shipping_address,
      payment_method,
      payment_status: "pending",
      order_status: "pending",
      invoice_number,
      total_amount,
      coupon_id,
      vnp_expire_at: new Date(Date.now() + 15 * 60000),
    });

    // Nếu COD
    if (payment_method === "cash_on_delivery") {
      return res.status(201).json({
        success: true,
        message: "Đơn hàng tạo thành công. Thanh toán khi nhận hàng",
        data: { order },
      });
    }

    // Nếu VNPAY
    const { paymentUrl, expireDate } = await createVnpayUrl(order, req, bank_code, language);
    order.vnp_url = paymentUrl;
    order.vnp_expire_at = expireDate;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Tạo link thanh toán VNPAY mới thành công",
      data: {
        order,
        redirect_url: paymentUrl,
      },
    });

  } catch (err) {
    console.error("Lỗi tạo đơn hàng:", err);
    return res.status(500).json({ success: false, message: "Lỗi server khi tạo đơn hàng" });
  }
};

export const handleVnpayIPN = async (req, res) => {
  try {
    const vnpParams = req.query;
    const secureHash = vnpParams.vnp_SecureHash;

    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sortedParams = Object.fromEntries(Object.entries(vnpParams).sort());
    const signData = qs.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
    const checkSum = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== checkSum) {
      return res.status(200).json({ RspCode: "97", Message: "Sai chữ ký" });
    }

    const invoice_number = vnpParams.vnp_TxnRef;
    const order = await Order.findOne({ invoice_number });

    if (!order) {
      return res.status(200).json({ RspCode: "01", Message: "Không tìm thấy đơn hàng" });
    }

    if ((order.total_amount * 100) !== Number(vnpParams.vnp_Amount)) {
      return res.status(200).json({ RspCode: "04", Message: "Số tiền không khớp" });
    }

    if (order.payment_status === "completed") {
      return res.status(200).json({ RspCode: "00", Message: "Đã thanh toán" });
    }

    const respCode = vnpParams.vnp_ResponseCode;

    if (respCode === "00") {
      order.payment_status = "completed";
      order.order_status = "processing";
    } else {
      order.payment_status = "failed";
      order.order_status = "cancelled";
    }

    await order.save();

    return res.status(200).json({ RspCode: "00", Message: "Cập nhật đơn hàng thành công" });

  } catch (err) {
    console.error("Lỗi xử lý IPN:", err);
    return res.status(200).json({ RspCode: "99", Message: "Lỗi server", error: err.message });
  }
};
