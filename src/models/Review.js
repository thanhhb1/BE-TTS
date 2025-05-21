import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            require: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String
        },
        image: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
