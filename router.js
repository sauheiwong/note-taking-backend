import { Router } from "express";
import userController from "./controllers/userController.js";
import noteController from "./controllers/noteController.js";
import tagController from "./controllers/tagController.js";
import requireLogin from "./middleware/requireLogin.js";
import userValidator from "./validator/userVailtor.js";

export const router = Router();

//user
router.post(
  "/signup",
  [userValidator.usernameValidator(), userValidator.passwordValidator()],
  userController.signUp
);
router.post(
  "/login",
  [userValidator.usernameValidator(), userValidator.passwordValidator()],
  userController.login
);

//note
const noteRouter = Router();
router.use("/protected/note", requireLogin.requireLogin, noteRouter);
noteRouter.get("/", noteController.noteList);
noteRouter.get("/:id", noteController.noteSeachById);
noteRouter.post("/", noteController.noteCreate);
noteRouter.put("/:id", noteController.noteEditContentById);
noteRouter.put("/owner/addPremit/:id", noteController.noteAddEditerViewerById);
noteRouter.put(
  "/owner/removePremit/:id",
  noteController.noteRemoveEditerViewerById
);

//tag
const tagRouter = Router();
router.use("/protected/tag", requireLogin.requireLogin, tagRouter);
tagRouter.get("/", tagController.tagList);
