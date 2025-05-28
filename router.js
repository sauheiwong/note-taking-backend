import { Router } from "express";
import userController from "./controllers/userController.js";
import noteController from "./controllers/noteController.js";
import tagController from "./controllers/tagController.js";
import homeController from "./controllers/homeController.js";
import requireLogin from "./middleware/requireLogin.js";
import userValidator from "./validator/userVailtor.js";

const apiRouter = Router();
const viewRouter = Router();

//user
viewRouter.get("/signup", userController.signUpView);
apiRouter.post(
  "/signup",
  [userValidator.usernameValidator(), userValidator.passwordValidator()],
  userController.signUp
);
viewRouter.get("/", userController.loginView);
apiRouter.post(
  "/login",
  [userValidator.usernameValidator(), userValidator.passwordValidator()],
  userController.login
);
viewRouter.get("/logout", userController.logout);
const protectViewRouter = Router();
viewRouter.use("/protected", requireLogin.requireLogin, protectViewRouter);
protectViewRouter.get("/home", requireLogin.requireLogin, homeController.homeView);

//note
const noteRouter = Router();
const noteViewRouter = Router();
apiRouter.use("/protected/note", requireLogin.requireLogin, noteRouter);
viewRouter.use(
  "/protected/view/note",
  requireLogin.requireLogin,
  noteViewRouter
);
// noteRouter.get("/", noteController.noteList);
noteViewRouter.get("/:id", noteController.viewNoteSeachById);
noteRouter.get("/:id", noteController.noteSeachById);
noteRouter.post("/", noteController.noteCreate);
noteRouter.put("/:id", noteController.noteEditContentById);
noteRouter.put("/owner/addPremit/:id", noteController.noteAddEditerViewerById);
noteRouter.put(
  "/owner/removePremit/:id",
  noteController.noteRemoveEditerViewerById
);
noteRouter.delete("/:id", noteController.noteDeleteById);

//tag
const tagRouter = Router();
apiRouter.use("/protected/tag", requireLogin.requireLogin, tagRouter);
tagRouter.get("/", tagController.tagList);
// tagRouter.get("/:id", tagController.tagSeachById);
// tagRouter.post("/", tagController.tagCreate);
tagRouter.put("/:id", tagController.tagEditById);
tagRouter.put("/addToNote/:id", tagController.tagAddToNote);

export default {
  apiRouter,
  viewRouter,
};
