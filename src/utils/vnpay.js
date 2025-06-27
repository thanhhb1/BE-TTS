import qs from "qs";
import crypto from "crypto";
import moment from "moment";
import dotenv from "dotenv";
dotenv.config();

export const createVnpayUrl = (order, req, bankCode = "", locale = "vn") => {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const vnpUrl = process.env.VNPAY_URL;
  const returnUrl = process.env.VNPAY_RETURN_URL;

  if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
    throw new Error("Thiếu cấu hình VNPAY trong .env");
  }

  const createDate = moment().format("YYYYMMDDHHmmss");
  const expireDate = moment().add(15, "minutes").format("YYYYMMDDHHmmss");

  const vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: order.total_amount * 100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: order.invoice_number,
    vnp_OrderInfo: `Thanh toán đơn hàng ${order.invoice_number}`,
    vnp_OrderType: "billpayment",
    vnp_Locale: locale,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: req.headers["x-forwarded-for"] || req.connection.remoteAddress || "127.0.0.1",
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  if (bankCode) {
    vnpParams["vnp_BankCode"] = bankCode;
  }

  
  const sortedParams = Object.fromEntries(Object.entries(vnpParams).sort());

  
  const signData = qs.stringify(sortedParams, { encode: false });

  
  const hmac = crypto.createHmac("sha512", secretKey);
  const secureHash = hmac.update(signData, "utf-8").digest("hex");

 
  const queryString = qs.stringify(sortedParams, { encode: true });
  const paymentUrl = `${vnpUrl}?${queryString}&vnp_SecureHash=${secureHash}`;

  return {
    paymentUrl,
    expireDate: moment(expireDate, "YYYYMMDDHHmmss").toDate(),
  };
};
