import { Router } from "express";
import userController from "./controllers/userController.js";
import noteController from "./controllers/noteController.js";
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
apiRouter.get("/logout", userController.logout);
const protectViewRouter = Router();

// protected view router
viewRouter.use("/protected", requireLogin.requireLogin, protectViewRouter);
protectViewRouter.get("/home", requireLogin.requireLogin, homeController.homeView);

//note
const noteRouter = Router();
const noteViewRouter = Router();
apiRouter.use("/protected/notes", requireLogin.requireLogin, noteRouter);
viewRouter.use(
  "/protected/view/notes",
  requireLogin.requireLogin,
  noteViewRouter
);
noteRouter.get("/", noteController.noteList);
noteViewRouter.get("/:id", noteController.viewNoteSeachById);
noteRouter.post("/", noteController.noteCreate);
noteRouter.put("/:id", noteController.noteEditContentById);
noteRouter.delete("/:id", noteController.noteDeleteById);

export default {
  apiRouter,
  viewRouter,
};
