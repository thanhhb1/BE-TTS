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
      return res.validation(error.details[0].message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.error("Email hoặc mật khẩu không đúng", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.error("Email hoặc mật khẩu không đúng", 400);
    }

    if (!user.isVerified) {
      return res.error("Email chưa được xác thực. Vui lòng xác thực OTP.", 403);
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



export const sendOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Thiếu email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    const today = new Date().toISOString().slice(0, 10);
    const lastSent = user.otpLastSentAt
      ? new Date(user.otpLastSentAt).toISOString().slice(0, 10)
      : null;

    if (!lastSent || lastSent !== today) {
      user.otpSendCount = 0;
      user.otpLastSentAt = new Date(); 
    }

    if ((user.otpSendCount || 0) >= 5) {
      return res.status(429).json({
        message: "Bạn đã gửi quá nhiều OTP hôm nay. Vui lòng thử lại ngày mai.",
      });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    
    user.otp = otp;
    user.otpExpiresAt = expiresAt;
    user.otpSendCount = (user.otpSendCount || 0) + 1;
    user.otpLastSentAt = new Date();

    await user.save();


    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    
    await transporter.sendMail({
      from: `"Shampoo App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Mã OTP xác thực",
      html: `<p>Mã OTP của bạn là: <b>${otp}</b></p><p>Có hiệu lực trong vòng 2 phút.</p>`,
    });

    return res.status(200).json({ message: "Đã gửi mã OTP" });
  } catch (err) {
    console.error("Lỗi gửi OTP:", err);
    return res.status(500).json({ message: "Lỗi máy chủ. Không gửi được OTP." });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.error("Thiếu thông tin xác thực OTP", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.error("Người dùng không tồn tại", 404);
    }


    if (user.isLocked) {
      return res.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ nhân viên hỗ trợ.", 403);
    }


    if (user.otpBlockedUntilVerify && user.otpBlockedUntilVerify > new Date()) {
      const remainingMs = user.otpBlockedUntilVerify - new Date();
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return res.error(`Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau ${remainingMinutes} phút.`, 429);
    }


    if (user.otp !== otp) {
      user.otpWrongCountVerify = (user.otpWrongCountVerify || 0) + 1;

      if (user.otpWrongCountVerify === 5) {
        user.otpBlockedUntilVerify = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        return res.error("Bạn đã nhập sai 5 lần. Vui lòng thử lại sau 10 phút.", 429);
      }

      if (user.otpWrongCountVerify === 6) {
        user.otpBlockedUntilVerify = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();
        return res.error("Bạn đã nhập sai 6 lần. Vui lòng thử lại sau 30 phút.", 429);
      }

      if (user.otpWrongCountVerify >= 7) {
        user.isLocked = true;
        await user.save();
        return res.error("Tài khoản của bạn đã bị khóa do nhập sai OTP quá nhiều lần. Vui lòng liên hệ nhân viên hỗ trợ.", 403);
      }

      await user.save();
      return res.error("Mã OTP không chính xác", 400);
    }


    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.error("Mã OTP đã hết hạn", 400);
    }


    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpWrongCountVerify = 0;
    user.otpBlockedUntilVerify = null;
    user.isLocked = false;

    await user.save();

    return res.success(null, "Xác thực OTP thành công");
  } catch (error) {
    console.error(error);
    return res.error("Lỗi máy chủ", 500);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.error("Email không tồn tại", 404);
    }

    
    const today = new Date().toISOString().slice(0, 10);
    const lastSent = user.otpLastSentAt
      ? new Date(user.otpLastSentAt).toISOString().slice(0, 10)
      : null;

    
    if (!lastSent || lastSent !== today) {
      user.otpSendCount = 0;
      user.otpLastSentAt = new Date();
    }

    if ((user.otpSendCount || 0) >= 5) {
      return res.error(
        "Bạn đã gửi quá nhiều OTP hôm nay. Vui lòng thử lại vào ngày mai.",
        429
      );
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); 

    user.otp = otp;
    user.otpExpiresAt = expiresAt;
    user.otpSendCount = (user.otpSendCount || 0) + 1;
    user.otpLastSentAt = new Date(); 

    await user.save();

    
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      html: `<p>Mã OTP của bạn là: <b>${otp}</b></p><p>Hết hạn trong 2 phút</p>`,
    });

    return res.success(null, "Mã OTP đặt lại mật khẩu đã được gửi!", 200);
  } catch (err) {
    return res.error(err.message, 500);
  }
};


export const verifyForgotOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.error("Thiếu thông tin", 400);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.error("Người dùng không tồn tại", 404);
    }


    if (user.isLocked) {
      return res.error("Tài khoản đã bị khóa. Vui lòng liên hệ nhân viên hỗ trợ.", 403);
    }


    if (user.otpBlockedUntilForgot && user.otpBlockedUntilForgot > new Date()) {
      const minutesLeft = Math.ceil((user.otpBlockedUntilForgot - new Date()) / 60000);
      return res.error(`Bạn đã nhập sai quá nhiều lần, vui lòng thử lại sau ${minutesLeft} phút.`, 429);
    }


    if (user.otp !== otp) {
      user.otpWrongCountForgot = (user.otpWrongCountForgot || 0) + 1;

      if (user.otpWrongCountForgot === 5) {
        user.otpBlockedUntilForgot = new Date(Date.now() + 10 * 60 * 1000); 
      } else if (user.otpWrongCountForgot === 6) {
        user.otpBlockedUntilForgot = new Date(Date.now() + 30 * 60 * 1000); 
      } else if (user.otpWrongCountForgot >= 7) {
        user.isLocked = true;
      }

      await user.save();
      return res.error("Mã OTP không chính xác", 400);
    }


    if (!user.otpExpiresAt || new Date(user.otpExpiresAt) < new Date()) {
      return res.error("Mã OTP đã hết hạn", 400);
    }


    user.otp = null;
    user.otpExpiresAt = null;
    user.otpWrongCountForgot = 0;
    user.otpBlockedUntilForgot = null;
    user.isAllowedResetPassword = true;

    await user.save();

    return res.success(null, "Xác thực OTP thành công, bạn có thể đặt lại mật khẩu");
  } catch (err) {
    return res.error(err.message, 500);
  }
};



export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.error("Thiếu thông tin", 400);
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isAllowedResetPassword) {
      return res.error("Bạn chưa xác thực OTP hoặc không được phép đặt lại mật khẩu", 403);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.isAllowedResetPassword = false;
    await user.save();

    return res.success(null, "Đặt lại mật khẩu thành công");
  } catch (err) {
    return res.error(err.message, 500);
  }
};
