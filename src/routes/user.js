import express from "express";
import {
    getUsers,
    create,
    hide,
    unHide
} from "../controllers/user.js";

const routerUser=express.Router();

routerUser.get("/",getUsers);
routerUser.post("/",create);
routerUser.patch("/:id/hide", hide);
routerUser.patch("/:id/unhide", unHide);


export default routerUser;