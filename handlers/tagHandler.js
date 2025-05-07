import Tag from "../models/tagModel.js";
import mongoose from "mongoose";
import myError from "../function/error.js";

const tagSeach = async (query, userId) => {
  try {
    query.owner = userId;
    query.name = {
      $regex: query.name,
      $options: "i",
    };
    const tag = await Tag.find(query, "name").populate("owner", "username");
    return tag;
  } catch (error) {
    throw error;
  }
};

export default {
  tagSeach,
};
