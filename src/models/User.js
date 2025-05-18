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
            match: [/^\S+@\S+\.\S+$/]
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String
        },
        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
            default: new mongoose.Types.ObjectId("68298bbac47d4718e12fe1cd")

        },
        contact_subject: {
            type: String
        },
        contact_message: {
            type: String
        },
        contact_status: {
            type: Boolean, default: false
        },
        status: {
            type: Boolean, default: true
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const User = mongoose.model('User', userSchema);
export default User;
