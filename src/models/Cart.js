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
                variation_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'ProductVariant'
                },
                quantity: {
                    type: Number
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
