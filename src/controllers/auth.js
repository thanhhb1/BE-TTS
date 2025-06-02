import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { loginSchema, resetPasswordSchema } from '../validation/user.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message); // 400
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.error("Email không tồn tại", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.error("Mật khẩu không đúng", 400);
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.success(
      {
        accessToken: token,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
        }
      },
      "Đăng nhập thành công",
      200
    );

  } catch (err) {
    return res.error(err.message, 500);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.error("Email không tồn tại", 404);
    }

    const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET, {
      expiresIn: "15m",
    });

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Click vào link sau để đặt lại mật khẩu:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    return res.success(null, "Email đặt lại mật khẩu đã được gửi!", 200);
  } catch (err) {
    return res.error(err.message, 500);
  }
};

export const resetPassword = async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.validation(error.details[0].message); // 400
  }

  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.error("Token không hợp lệ hoặc đã hết hạn", 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.success(null, "Đặt lại mật khẩu thành công", 200);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.error("Token đã hết hạn", 400);
    }
    return res.error(error.message, 500);
  }
};
