import User from "../../models/User.js";
import Role from "../../models/Role.js";
import { successResponse, errorResponse, validationError } from "../../utils/response.js";

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
      .populate('role', 'name')
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
