import Category from "../../models/Category.js";
import Product from "../../models/Product.js";
import { categoryValid } from "../../validation/category.js";
import { successResponse, errorResponse,validationError } from "../../utils/response.js";

export const getCategories = async (req, res) => {
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
            return errorResponse(res, "Không tìm thấy danh mục nào");
        }
      //Lấy sản phẩm cho từng danh mục
        const categoriesWithProducts = await Promise.all(
            categories.map(async (category) => {
                const products = await Product.find({ category_id: category._id });
                return {
                    ...category.toObject(),
                    products
                };
            })
        );
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

export const getById = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, isDeleted: false });

        if (!category) {
            return successResponse(res, null, "Danh mục không tồn tại");
        }

        return successResponse(res, category, "Lấy danh mục thành công");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const create = async (req, res) => {
  try {
    const { error } = categoryValid.validate(req.body);
    if (error) {
      return validationError(res, error.details[0].message);
    }

    const newCategory = await Category.create(req.body);
    return successResponse(res, newCategory, "Thêm danh mục thành công");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const update = async (req, res) => {
  try {
    const { error } = categoryValid.validate(req.body);
    if (error) {
      return validationError(res, error.details[0].message);
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return errorResponse(res, "Không tìm thấy danh mục để cập nhật");
    }

    return successResponse(res, updatedCategory, "Cập nhật danh mục thành công");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const DEFAULT_CATEGORY_NAME = "Không xác định";

const getDefaultCategory = async () => {
    let defaultCategory = await Category.findOne({ name: DEFAULT_CATEGORY_NAME });
    if (!defaultCategory) {
        defaultCategory = await Category.create({ name: DEFAULT_CATEGORY_NAME, isDeleted: false });
    }
    return defaultCategory;
};

export const remove = async (req, res) => {
    try {
        const defaultCategory = await getDefaultCategory();

        if (req.params.id === defaultCategory._id.toString()) {
            return errorResponse(res, "Không thể xóa danh mục mặc định");
        }


        const categoryToDelete = await Category.findOne({ _id: req.params.id, isDeleted: false });
        if (!categoryToDelete) {
            return errorResponse(res, "Không tìm thấy danh mục để xóa mềm");
        }


        await Product.updateMany(
            { category_id: categoryToDelete._id },
            { category_id: defaultCategory._id, oldCategory: categoryToDelete._id }
        );


        categoryToDelete.isDeleted = true;
        await categoryToDelete.save();

        return successResponse(res, categoryToDelete, "Xóa mềm danh mục thành công");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const restore = async (req, res) => {
    try {
        const defaultCategory = await getDefaultCategory();

        if (req.params.id === defaultCategory._id.toString()) {
            return errorResponse(res, "Không thể khôi phục danh mục mặc định");
        }

        const restoredCategory = await Category.findOneAndUpdate(
            { _id: req.params.id, isDeleted: true },
            { isDeleted: false },
            { new: true }
        );

        if (!restoredCategory) {
            return errorResponse(res, "Không tìm thấy danh mục để khôi phục");
        }


        await Product.updateMany(
            { oldCategory: restoredCategory._id, category_id: defaultCategory._id },
            { category_id: restoredCategory._id, $unset: { oldCategory: "" } }
        );


        return successResponse(res, restoredCategory, "Khôi phục danh mục thành công");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const permanentlyRemove = async (req, res) => {
    try {
        const defaultCategory = await getDefaultCategory();

        if (req.params.id === defaultCategory._id.toString()) {
            return errorResponse(res, "Không thể xóa vĩnh viễn danh mục mặc định");
        }

        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return errorResponse(res, "Không tìm thấy danh mục để xóa vĩnh viễn");
        }

        return successResponse(res, deletedCategory, "Xóa vĩnh viễn danh mục thành công");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};


