import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { loginSchema } from '../validation/user.js';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.success(null,"Email không tồn tại");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.success(null,"Mật khẩu không đúng");
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    return res.success({
      message: "Đăng nhập thành công",
      accessToken: token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    return res.error(err.message);
  }
};
