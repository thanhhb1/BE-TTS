import express from 'express';
import { login,forgotPassword,resetPassword,sendOtpEmail,verifyForgotOtp,verifyOtp } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.post("/send-otp-email", sendOtpEmail);
router.post("/verify-otp-email", verifyOtp);

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp-forgot', verifyForgotOtp);
router.post('/reset-password', resetPassword);


export default router;
