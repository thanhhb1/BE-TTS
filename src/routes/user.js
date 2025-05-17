import express from "express";
import {
    getUsers,
    create
} from "../controllers/user.js";

const routerUser=express.Router();

routerUser.get("/",getUsers);
routerUser.post("/",create);




export default routerUser;