import Role from "../models/Role.js";
import { successResponse ,errorResponse } from "../utils/response.js";

export const getRoles=async(req ,res)=>{
    try {
        
        const roles=await Role.find();
        return successResponse(res,roles,"Thành công");
    } catch (error) {
         return errorResponse(res, error.message);
    }
}