import express from "express";
import {
    getUsers,
} from "../../controllers/admin/user.js";

const routerUser=express.Router();

routerUser.get("/",getUsers);



export default routerUser;