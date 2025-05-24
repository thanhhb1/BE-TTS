import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { categoryValid } from "../validation/category.js";


export const getCategories = async (req, res) => {
    try {
        let { _limit = 10, _page = 1, _sort = "createdAt", _order = "desc", search = "" } = req.query;

        

        const query = {
            isDeleted: false,
            name: { $regex: search, $options: "i" },
        };

        const result = await Category.countDocuments(query);

        const listCategories = await Category.find(query)
            .sort({ [_sort]: _order === "asc" ? 1 : -1 })
            .skip((_page - 1) * _limit)
            .limit(_limit)
            .populate('products', "_id");

        return res.success(
            {
                result,
                currPage: _page,
                limit: _limit,
                data: listCategories,
                hasMore: _page * _limit < result,
            },
            "Lấy danh sách danh mục thành công"
        );
    } catch (error) {
        return res.error(error.message);
    }
};





export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, isDeleted: false });

        if (!category) {
            return res.success(null, "Danh mục không tồn tại");
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

        const isExist = await Category.findOne({ name: req.body.name });
        if (isExist) {
            return res.error("Tên danh mục đã tồn tại");
        }

        const newCategory = await Category.create(req.body);
        return res.success(newCategory, "Thêm danh mục thành công");
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
            _id: req.params.id ,
            name: req.body.name
        });
        if (isExist) {
            return res.error("Tên danh mục đã tồn tại");
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );

        if (!updatedCategory) {
            return res.success(null, "Không tìm thấy danh mục để cập nhật");
        }

        return res.success(updatedCategory, "Cập nhật danh mục thành công");
    } catch (error) {
        return res.error(error.message);
    }
};




export const removeCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!category) {
      return res.success(null, "Danh mục không tồn tại hoặc đã bị xóa.");
    }

    category.isDeleted = true;
    await category.save();

    return res.success(null, "Đã chuyển danh mục vào thùng rác.");
  } catch (error) {
    return res.error( error.message);
  }
};

export const getDeletedCategories = async (req, res) => {
  try {
    const deletedCategories = await Category.find({ isDeleted: true });

    if (deletedCategories.length === 0) {
      return res.success(null, "Không có danh mục nào trong thùng rác.");
    }

    return res.success(deletedCategories, "Lấy danh sách danh mục trong thùng rác thành công.");
  } catch (error) {
    return res.error( error.message);
  }
};



export const restoreCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: true,
    });
    if (!category) {
      return res.success(null, "Không tìm thấy danh mục cần khôi phục.");
    }

    category.isDeleted = false;
    await category.save();

    return res.success(category, "Khôi phục danh mục thành công.");
  } catch (error) {
    return res.error(+ error.message);
  }
};

export const forceDeleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: true,
    });

    if (!category) {
      return res.success(null, "Không tìm thấy danh mục trong thùng rác.");
    }

    // Tạo danh mục "Không xác định"
    let uncategorized = await Category.findOne({ name: "Không xác định", isDeleted: false });

    if (!uncategorized) {
      uncategorized = await Category.create({
        name: "Không xác định",
        description: "Danh mục mặc định cho các sản phẩm không xác định",
        isDeleted: false
      });
    }

    // Chuyển toàn bộ sản phẩm về danh mục "Không xác định"
    await Product.updateMany(
      { category_id: category._id },
      { $set: { category_id: uncategorized._id } }
    );

    // Xóa vĩnh viễn danh mục
    await Category.deleteOne({ _id: category._id });

    return res.success(null, "Xóa vĩnh viễn danh mục thành công và đã chuyển sản phẩm sang 'Không xác định'.");
  } catch (error) {
    return res.error(error.message);
  }
};

