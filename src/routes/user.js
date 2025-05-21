import express from "express";
import {
    getUsers,
    createUser,
    hideUser,
    unHideUser,updateUser
} from "../controllers/user.js";

const routerUser=express.Router();

routerUser.get("/",getUsers);
routerUser.post("/",createUser);
routerUser.put("/:id",updateUser);
routerUser.patch("/:id/hide", hideUser);
routerUser.patch("/:id/unhide", unHideUser);


export default routerUser;