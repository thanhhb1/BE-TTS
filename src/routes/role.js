import express from "express";
import {
    getRoles,
} from "../controllers/role.js";

const routerRole=express.Router();

routerRole.get("/",getRoles);





export default routerRole;