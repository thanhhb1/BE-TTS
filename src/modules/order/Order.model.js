import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        payment_method: {
            type: String,
            enum: ["vnpay", "cash_on_delivery"],
            required: true,
        },
        payment_status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded", "canceled"],
            default: "pending",
        },
        order_status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
            ],
            default: "pending",
        },
        invoice_number: {
            type: String,
        },
        total_amount: {
            type: Number,
            required: true,
        },
        coupon_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
        },
        items: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                variant_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ProductVariant",
                    default: null
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                total_amount: {
                    type: Number
                },
            },
        ],


        shipping_address: {
            address: { type: String, required: true },
            city: { type: String },
            country: { type: String },
        },
        vnp_url: {
            type: String,
            default: null,
        },
        vnp_expire_at: {
            type: Date,
            default: null,
        },
    
    },
{
    timestamps: true,
        versionKey: false,
    }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
