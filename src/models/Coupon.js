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
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
