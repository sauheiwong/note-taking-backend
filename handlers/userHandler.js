import User from "../models/userModel.js";
import myError from "../function/error.js";
import bcrypt from "bcryptjs";

const registerUser = async (username, password) => {
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw myError.errorStatus("username has been used", 409);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw myError.errorStatus("username or password are wrong", 401);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw myError.errorStatus("username or password are wrong", 401);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
};
