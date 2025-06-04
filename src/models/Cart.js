import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        items: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                variant_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ProductVariant'
                },
                quantity: {
                    type: Number,
                    default: 1,        
                    min: 1,
                },
                subtotal: {
                    type: Number
                },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
