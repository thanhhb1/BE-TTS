import mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
