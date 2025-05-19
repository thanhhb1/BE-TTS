import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
    {
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        origin: {
            type: String
        },
        description: {
            type: String
        },
        images: [{
            type: String,
            required:true
        }],
        size: {
            type: String
        },
        fragrance: {
            type: String
        },
        hair_type: {
            type: String
        },
        stock_quantity: {
            type: Number,
            default: 0,
            min: 0
        },
        price: {
            type: Number,
            required:true,
            min: 0
        },
        discount_price: {
            type: Number,
            min: 0
        },
        variation_status: {
            type: Boolean, default: false
        },
        isDeleted: {
  type: Boolean,
  default: false,
},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
