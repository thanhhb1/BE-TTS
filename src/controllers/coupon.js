import Coupon from "../models/Coupon.js";
import { couponValid } from "../validation/coupon.js";

export const getCoupons = async (req, res) => {
  try {
    let {
      _limit = 10,
      _page = 1,
      _sort = "createdAt",
      _order = "desc",
      search = ""
    } = req.query;

    _limit = parseInt(_limit);
    _page = parseInt(_page);

    const query = {
      isDeleted: false,
      code: { $regex: search, $options: "i" }
    };

    const result = await Coupon.countDocuments(query);

    const coupons = await Coupon.find(query)
      .sort({ [_sort]: _order === "asc" ? 1 : -1 })
      .skip((_page - 1) * _limit)
      .limit(_limit);

    return res.success({
      result,
      currPage: _page,
      limit: _limit,
      data: coupons,
      hasMore: _page * _limit < result,
    }, "Lấy danh sách mã giảm giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ _id: req.params.id, isDeleted: false });
    if (!coupon) {
      return res.error("Không tìm thấy mã giảm giá", 404);
    }
    return res.success(coupon, "Lấy mã giảm giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { error } = couponValid.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message);
    }

    const existingCoupon = await Coupon.findOne({ code: req.body.code, isDeleted: false });
    if (existingCoupon) {
      return res.error("Mã giảm giá đã tồn tại", 400);
    }

    const coupon = await Coupon.create(req.body);
    return res.success(coupon, "Tạo mã giảm giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = couponValid.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message);
    }

    const existingCoupon = await Coupon.findOne({ code: req.body.code, _id: { $ne: id }, isDeleted: false });
    if (existingCoupon) {
      return res.error("Mã giảm giá đã tồn tại", 400);
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCoupon) {
      return res.error("Không tìm thấy mã giảm giá", 404);
    }

    return res.success(updatedCoupon, "Cập nhật mã giảm giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const removeCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!coupon) {
      return res.error("Không tìm thấy mã giảm giá", 404);
    }

    return res.success(coupon, "Đã xóa mềm mã giảm giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const restoreCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );

    if (!coupon) {
      return res.error("Không tìm thấy mã giảm giá", 404);
    }

    return res.success(coupon, "Khôi phục mã giảm giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const getDeletedCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isDeleted: true });
    return res.success(coupons, "Lấy danh sách mã giảm giá đã xóa mềm");
  } catch (error) {
    return res.error(error.message);
  }
};

export const forceDeleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.error("Không tìm thấy mã giảm giá", 404);
    }

    return res.success(null, "Đã xóa vĩnh viễn mã giảm giá");
  } catch (error) {
    return res.error(error.message);
  }
};
