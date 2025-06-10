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
    return res.redirect('/')
  } catch (error) {
    return res.render("signup", { title: "Sign Up", error: error.message });
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
  } catch (error) {
    console.error(error);
    return res.render("login", { title: "Login", error: error });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/protected/home"); 
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    return res.redirect("/"); 
  });
};

export default {
  signUp,
  login,
  signUpView,
  loginView,
  logout,
};
