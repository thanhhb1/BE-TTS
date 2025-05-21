import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@[a-zA-Z]+[a-zA-Z0-9.-]*\.[a-z]{2,}$/]
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        
        role: {
            type: String,
            enum: ['admin', 'user', 'manage'],
            default: 'user',
            required: true,
        },
        contact_subject: {
            type: String,
        },
        contact_message: {
            type: String,
        },
        contact_status: {
            type: Boolean,
            default: false,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const User = mongoose.model('User', userSchema);
export default User;
