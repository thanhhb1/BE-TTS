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

    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true,
    versionKey: false,
});

const User = mongoose.model('User', userSchema);
export default User;
