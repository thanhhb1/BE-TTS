import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { categoryValid } from "../validation/category.js";

export const getCategories = async (req, res) => {
  try {
    let { _limit = 10, _page = 1, _sort = "createdAt", _order = "desc", search = "" } = req.query;

    _limit = parseInt(_limit);
    _page = parseInt(_page);

    const query = {
      isDeleted: false,
      name: { $regex: search, $options: "i" },
    };

    const total = await Category.countDocuments(query);

    const listCategories = await Category.find(query)
      .sort({ [_sort]: _order === "asc" ? 1 : -1 })
      .skip((_page - 1) * _limit)
      .limit(_limit)
      .populate("products", "_id");

    return res.success({
      total,
      currPage: _page,
      limit: _limit,
      data: listCategories,
      hasMore: _page * _limit < total,
    }, "Lấy danh sách danh mục thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, isDeleted: false });

    if (!category) {
      return res.error("Danh mục không tồn tại", 404);
    }

    return res.success(category, "Lấy danh mục thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const createCategory = async (req, res) => {
  try {
    const { error } = categoryValid.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message);
    }

    const isExist = await Category.findOne({ name: req.body.name, isDeleted: false });
    if (isExist) {
      return res.error("Tên danh mục đã tồn tại", 400);
    }

    const newCategory = await Category.create(req.body);
    return res.success(newCategory, "Tạo danh mục thành công", 201);
  } catch (error) {
    return res.error(error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { error } = categoryValid.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message);
    }

    const isExist = await Category.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id },
      isDeleted: false
    });

    if (isExist) {
      return res.error("Tên danh mục đã tồn tại", 400);
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return res.error("Không tìm thấy danh mục để cập nhật", 404);
    }

    return res.success(updatedCategory, "Cập nhật danh mục thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const removeCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, isDeleted: false });

    if (!category) {
      return res.error("Danh mục không tồn tại hoặc đã bị xóa", 404);
    }

    category.isDeleted = true;
    await category.save();

    return res.success(category, "Xóa mềm danh mục thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const getDeletedCategories = async (req, res) => {
  try {
    const deletedCategories = await Category.find({ isDeleted: true });

    return res.success(deletedCategories, "Lấy danh sách danh mục đã xóa mềm thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const restoreCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: true,
    });

    if (!category) {
      return res.error("Không tìm thấy danh mục cần khôi phục", 404);
    }

    category.isDeleted = false;
    await category.save();

    return res.success(category, "Khôi phục danh mục thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const forceDeleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: true,
    });

    if (!category) {
      return res.error("Không tìm thấy danh mục trong thùng rác", 404);
    }

    let uncategorized = await Category.findOne({ name: "Danh mục mặc định", isDeleted: false });

    if (!uncategorized) {
      uncategorized = await Category.create({
        name: "Danh mục mặc định",
        description: "Danh mục mặc định cho các sản phẩm không phân loại",
        isDeleted: false,
      });
    }

    await Product.updateMany(
      { category_id: category._id },
      { $set: { category_id: uncategorized._id } }
    );

    await Category.deleteOne({ _id: category._id });

    return res.success(null, "Xóa vĩnh viễn danh mục thành công và đã chuyển sản phẩm sang 'Danh mục mặc định'");
  } catch (error) {
    return res.error(error.message);
  }
};
