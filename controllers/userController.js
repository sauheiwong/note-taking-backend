import userHandler from "../handlers/userHandler.js";
import myError from "../function/error.js";
import { validationResult } from "express-validator";

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
    return myError.errorReturn(res, error);
  }
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

    return res.status(201).json({
      message: "login successful",
      user: user.username,
    });
  } catch (error) {
    console.error(error);
    return myError.errorReturn(res, error);
  }
};

export default {
  signUp,
  login,
};
