const productSchema = new mongoose.Schema(
    {
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
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
            type: String
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
            default: 0
        },
        price: {
            type: Number
        },
        discount_price: {
            type: Number
        },
        variation_status: {
            type: Boolean, default: false
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
