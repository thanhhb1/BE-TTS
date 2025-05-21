import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        discount: {
            type: Number
        },
        discount_type: {
            type: Boolean
        }, // true: %, false: số tiền
        start_date: {
            type: Date
        },
        expiration_date: {
            type: Date
        },
        max_uses: {
            type: Number,
            default: 1 // ví dụ mặc định chỉ dùng 1 lần
        },
        uses: {
            type: Number,
            default: 0
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
