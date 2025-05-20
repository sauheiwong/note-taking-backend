import userHandler from "../handlers/userHandler.js";
import myError from "../function/error.js";
import { validationResult } from "express-validator";

const signUpView = (req, res) => {
  return res.render("signup", { title: "Sign Up", error: null });
};

const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const newUser = await userHandler.registerUser(
      username.toLowerCase(),
      password
    );
    return res
      .status(201)
      .json({ message: "register successful", user: newUser.username });
  } catch (error) {
    return res.render("signup", { title: "Sign Up", error: error.message });
    return myError.errorReturn(res, error);
  }
};

const loginView = (req, res) => {
  return res.render("login", { title: "Login", error: null });
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;

    const user = await userHandler.loginUser(username.toLowerCase(), password);

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.loggedIn = true;

    return res.redirect("/protected/home");
    return res.status(201).json({
      message: "login successful",
      user: user.username,
    });
  } catch (error) {
    console.error(error);
    return res.render("login", { title: "Login", error: error });
    return myError.errorReturn(res, error);
  }
};

export default {
  signUp,
  login,
  signUpView,
  loginView,
};
