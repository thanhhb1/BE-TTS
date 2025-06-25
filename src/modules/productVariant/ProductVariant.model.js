import mongoose from "mongoose";
const productVariantSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
         image: {
      type: String,
      required: true  
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
            type: Number, default: 0
        },
        price: {
            type: Number
        },
        discount_price: {
            type: Number
        },
        variant_status: {
            type: Boolean,
            default: true
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

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);
export default ProductVariant;
