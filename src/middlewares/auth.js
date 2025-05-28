import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.error(null,"Không có token hoặc token sai định dạng");
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id); 
    if (!user) {
      return res.error(null,"Không tìm thấy người dùng");
    }

    req.user = user; 
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.error("Token đã hết hạn");
    }
    return res.error("Token không hợp lệ");
  }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.error("Không có quyền truy cập");
    }
    next();
  };
};
