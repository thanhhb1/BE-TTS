import mongoose, { Mongoose } from "mongoose";
const productSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    
    

},{timestamps:true,versionKey:false})

const Product=mongoose.model("Product",productSchema);
export default Product;