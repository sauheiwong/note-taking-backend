import { body } from "express-validator";

const usernameValidator = () =>
  body("username")
    .notEmpty()
    .withMessage("please provide your username")
    .isAlphanumeric()
    .withMessage("please provide username with letters and numbers only");
const passwordValidator = () =>
  body("password").notEmpty().withMessage("please provide your password");
export default {
  usernameValidator,
  passwordValidator,
};
