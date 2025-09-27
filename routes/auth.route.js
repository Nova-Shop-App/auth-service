import express from "express";
import AuthController from "../Controllers/auth.controllers.js";

const auth = express.Router();

auth.post("/register", AuthController.registerUser);
auth.post("/login", AuthController.loginUser);
auth.get("/verify", AuthController.verifyUser);

export default auth;
