import express from "express";
import {
  getUsers,
  createUser,
  hideUser,
  unHideUser,
  updateUser,
  deleteUser
} from "./user.controller.js";
import { authenticate, authorizeRoles } from "../../middlewares/auth.js";

const routerUser = express.Router();

routerUser.get("/", authenticate, authorizeRoles("admin", "manage"), getUsers);
routerUser.post("/", authenticate, authorizeRoles("admin", "manage"), createUser);
routerUser.put("/:id", authenticate, authorizeRoles("admin", "manage"), updateUser);
routerUser.delete("/:id", authenticate, authorizeRoles("admin"), deleteUser);
routerUser.patch("/:id/hide", authenticate, authorizeRoles("admin", "manage"), hideUser);
routerUser.patch("/:id/unhide",authenticate, authorizeRoles("admin", "manage"), unHideUser);

export default routerUser;
