import User from "../models/User.js";
import { userValid,roleValid } from "../validation/user.js";
import bcrypt from "bcrypt";


export const getUsers = async (req, res) => {
  try {
    let {
      _limit = 10,
      _page = 1,
      _sort = "createdAt",
      _order = "desc",
      search = "",
    } = req.query;

    _limit = parseInt(_limit);
    _page = parseInt(_page);

    
    const query = {
      $or: [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ],
      status: true, 
    };

    const result = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ [_sort]: _order === "asc" ? 1 : -1 })
      .skip((_page - 1) * _limit)
      .limit(_limit);

    return res.success(
      {
        result,
        currPage: _page,
        limit: _limit,
        data: users,
        hasMore: _page * _limit < result,
      },
      "Lấy danh sách người dùng thành công"
    );
  } catch (error) {
    return res.error("Lấy danh sách người dùng thất bại: " + error.message);
  }
};



export const createUser = async (req, res) => {
  try {
    const { error } = userValid.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message);
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.validation("Email đã được đăng ký, vui lòng dùng email khác.");
    }

    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = { ...req.body, password: hashedPassword };

    const newUser = await User.create(userData);

    return res.success(newUser, "Tạo tài khoản thành công");
  } catch (error) {
    return res.error(error.message);
  }
};



export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    
    const { error } = roleValid.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message);
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: 'fullname email phone role' } 
    );

    if (!updatedUser) {
      return res.error("Người dùng không tồn tại");
    }

    
    return res.success(updatedUser, "Cập nhật vai trò thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const hideUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );

    if (!user) {
      return res.success(null, "Tài khoản không tồn tại");
    }

    return res.success(user, "Đã ẩn tài khoản thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const unHideUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: true },
      { new: true }
    );

    if (!user) {
      return res.success(null, "Tài khoản không tồn tại");
    }

    return res.success(user, "Đã bỏ ẩn tài khoản thành công");
  } catch (error) {
    return res.error(error.message);
  }
};
