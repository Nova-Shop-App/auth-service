import express from "express";
import UserController from "../Controllers/user.controllers.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";
const users = express.Router();

users.get("/", authentication, authorization, UserController.getAllUsers);
users.get("/:id", authentication, authorization, UserController.getUserById);
users.post("/", authentication, authorization, UserController.createUser);
users.put("/:id", authentication, authorization, UserController.updateUser);
users.delete("/:id", authentication, authorization, UserController.deleteUser);

export default users;
