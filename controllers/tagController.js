import tagHandler from "../handlers/tagHandler.js";
import myError from "../function/error.js";
import { validationResult } from "express-validator";

const tagList = async (req, res) => {
  try {
    const query = req.query;
    const tag = await tagHandler.tagSeach(query, req.session.userId);
    return res.status(200).json(tag);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

export default {
  tagList,
};
