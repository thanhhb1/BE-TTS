import User from "../models/User.js";
import Role from "../models/Role.js";
import { successResponse, errorResponse, validationError } from "../utils/response.js";
import { userValid } from "../validation/user.js";
import bcrypt from "bcrypt";
export const getUsers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    
    const roles = await Role.find({ name: { $regex: search, $options: 'i' } });
    const roleIds = roles.map(role => role._id);

    
    const condition = {
      $or: [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $in: roleIds } }
      ]
    };

    const total = await User.countDocuments(condition);

    const users = await User.find(condition)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('role_id', 'name')
      .exec();

    return successResponse(res, {
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      }
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


export const create = async (req, res) => {
  try {
    const { error } = userValid.validate(req.body);
    if (error) {
      return validationError(res, error.details[0].message);
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userData = { ...req.body, password: hashedPassword };
    const newUser = await User.create(userData);

    return successResponse(res, newUser, "Thêm tài khoản thành công");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};



