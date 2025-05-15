import Category from "../models/Category.js";


export const getAll = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    if (!categories.length) {
      return res.status(404).json({ message: "Không tìm thấy danh mục nào" });
    }
    return res.status(200).json({
      message: "Lấy danh sách danh mục thành công",
      datas: categories,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



