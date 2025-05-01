import userHandler from "../handlers/userHandler.js";
import myError from "../function/error.js";

const signUp = async (req, res) => {
  try {
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
    const { username, password } = req.body;
    if (!username || !password) {
      throw myError.errorStatus("please provide username and password", 400);
    }

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
