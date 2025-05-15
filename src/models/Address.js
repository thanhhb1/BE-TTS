const addressSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String
        },
        country: {
            type: String
        },
        is_default: {
            type: Boolean, default: false
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Address = mongoose.model('Address', addressSchema);
export default Address;
