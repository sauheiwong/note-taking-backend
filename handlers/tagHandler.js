import Tag from "../models/tagModel.js";
import mongoose from "mongoose";
import myError from "../function/error.js";

const tagSeach = async (query, userId) => {
  try {
    query.owner = userId;
    if (query.name) {
      query.name = {
        $regex: query.name,
        $options: "i",
      };
    }
    const tag = await Tag.find(query, "name").populate("owner", "username");
    return tag;
  } catch (error) {
    throw error;
  }
};

const tagSeachById = async (tagId, userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      throw myError.errorStatus("Invaild id", 400);
    }

    const tag = await Tag.findById(tagId, {
      __v: 0,
    });
    if (!tag) {
      throw myError.errorStatus("tag not found", 404);
    }

    if (!tag.owner.equals(userId)) {
      throw myError.errorStatus(
        "You do not have permission to read this tag.",
        403
      );
    }

    return tag;
  } catch (error) {
    throw error;
  }
};

export default {
  tagSeach,
  tagSeachById,
};
