import { Router } from "express";
import userController from "./controllers/userController.js";

export const router = Router();

//user
router.post("/signup", userController.signUp);
router.post("/login", userController.login);

// TODO: Fill in rest of CRUD routes
