import Coupon from "../models/Coupon.js";

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
