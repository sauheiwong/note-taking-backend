import { Router } from "express";
import userController from "./controllers/userController.js";
import noteController from "./controllers/noteController.js";
import requireLogin from "./middleware/requireLogin.js";

export const router = Router();

//user
router.post("/signup", userController.signUp);
router.post("/login", userController.login);

//note
const noteRouter = Router();
router.use("/protected/note", requireLogin.requireLogin, noteRouter);
noteRouter.get("/", noteController.noteList);
noteRouter.get("/:id", noteController.noteSeachById);

// TODO: Fill in rest of CRUD routes
