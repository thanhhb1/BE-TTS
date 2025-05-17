import mongoose from "mongoose";
const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Role = mongoose.model('Role', roleSchema);
export default Role;
