import Category from "../models/Category.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getAll = async (req, res) => {
  try {
    const { _limit = 10, _page = 1, _sort = "createdAt", _order = "desc", q = "" } = req.query;

    const query = {
      isDeleted: false,
      name: { $regex: q, $options: "i" },
    };

    const totalItems = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .sort({ [_sort]: _order === "asc" ? 1 : -1 })
      .skip((_page - 1) * _limit)
      .limit(Number(_limit));

    if (!categories.length) {
      return errorResponse(res, "Không tìm thấy danh mục nào", 404);
    }

    return successResponse(res, {
      categories,
      pagination: {
        _limit: Number(_limit),
        _page: Number(_page),
        _total: totalItems,
      },
    }, "Lấy danh sách danh mục thành công");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
