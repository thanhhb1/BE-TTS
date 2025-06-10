import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@[a-zA-Z]+[a-zA-Z0-9.-]*\.[a-z]{2,}$/],
    },
    password: {
        type: String,
        required: true,
    },
    phone: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'manage'],
        default: 'user',
        required: true,
    },


    addresses: [
        {
            address: { type: String, required: true },
            city: String,
            country: String,
            is_default: { type: Boolean, default: false },
        }
    ],

    contact_subject: String,
    contact_message: String,
    contact_status: { type: Boolean, default: false },
    status: { type: Boolean, default: true },


    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpiresAt: Date,
    otpSendCount: { type: Number, default: 0 },
    otpLastSentAt: Date,
    isAllowedResetPassword: { type: Boolean, default: false },
    otpWrongCountVerify: { type: Number, default: 0 },
    otpBlockedUntilVerify: { type: Date, default: null },

    otpWrongCountForgot: { type: Number, default: 0 },
    otpBlockedUntilForgot: { type: Date, default: null },
    isLocked: { type: Boolean, default: false },

}, {
    timestamps: true,
    versionKey: false,
});

const User = mongoose.model('User', userSchema);
export default User;
