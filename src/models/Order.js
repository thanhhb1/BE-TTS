import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        payment_method_id: {
            type: String
        },
        order_status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
            default: 'pending',
        },
        invoice_number: {
            type: String
        },
        total_amount: {
            type: Number
        },
        coupon_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon'
        },
        items: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                variation_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ProductVariant'
                },
                quantity: Number,
                price: Number,
                total_amount: Number,
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
