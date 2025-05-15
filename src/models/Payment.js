import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        payment_method: {
            type: String,
            enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded', 'canceled'],
            default: 'pending',
        },
        amount: { type: Number },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
