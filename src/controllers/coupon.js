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

        
        const query = {
            isDeleted: false,
            code: { $regex: search, $options: "i" }, 
        };

        const total = await Coupon.countDocuments(query);

        const coupons = await Coupon.find(query)
            .sort({ [_sort]: _order === "asc" ? 1 : -1 })
            .skip((_page - 1) * _limit)
            .limit(Number(_limit));

        return res.success(
            {
                result: total,
                currPage: Number(_page),
                limit: Number(_limit),
                data: coupons,
                hasMore: _page * _limit < total,
            },
            "Lấy danh sách mã giảm giá thành công"
        );
    } catch (error) {
        return res.error(error.message);
    }
};

export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ _id: req.params.id, isDeleted: false });
        if (!coupon){
            return res.success(null, "Không tìm thấy mã giảm giá" );
        } 
            
        return res.success(coupon,"Lấy mã giảm giá thành công");
    } catch (error) {
        return res.error( error.message );
    }
};

export const removeCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const existingCoupon = await Coupon.findOne({ _id: id, isDeleted: false });

        if (!existingCoupon) {
            return res.success(null, "Không tìm thấy mã giảm giá để xóa");
        }

        
        const deletedCoupon = await Coupon.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        return res.success(deletedCoupon, "Đã xóa mềm mã giảm giá thành công");
    } catch (error) {
        return res.error(error.message);
    }
};


export const createCoupon = async (req, res) => {
  try {
    
    const { error} = couponValid.validate(req.body);
    if (error) {
        return res.validation( error.details[0].message );
    }
    const { code, discount, discount_type, start_date, expiration_date, max_uses, isActive } = req.body;

    
    const existingCoupon = await Coupon.findOne({ code, isDeleted: false });
    if (existingCoupon) {
        return res.success(null, "Mã phiếu giảm giá đã tồn tại" );
    }
    const coupon = await Coupon.create(req.body);

    return res.success(coupon,"Mã giảm giá đã tạo ra thành công");
  } catch (error) {
    return res.error( error.message );
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { error} = couponValid.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message);
    }

    const { code, discount, discount_type, start_date, expiration_date, max_uses, isActive } = req.body;

    
    const existingCoupon = await Coupon.findOne({ code, _id: { $ne: id }, isDeleted: false });
    if (existingCoupon) {
      return res.success(null, "Mã phiếu giảm giá đã tồn tại");
    }

    
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedCoupon) {
      return res.success("Không tìm thấy mã phiếu giảm giá");
    }

    return res.success(updatedCoupon, "Cập nhật mã phiếu giảm giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const getDeletedCoupons = async (req, res) => {
  try {
    const deletedCoupons = await Coupon.find({ isDeleted: true });
    return res.success(deletedCoupons, "Danh sách mã giảm giá đã xóa mềm");
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
        return res.success(null,"Không tìm thấy mã giảm giá cần khôi phục");
    } 
    return res.success(coupon, "Khôi phục mã giảm giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const forceDeleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon){
        return res.success(null,"Không tìm thấy mã giảm giá cần xóa");
    } 
    return res.success(null, "Xóa vĩnh viễn mã giảm giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};
