import Tag from "../models/tagModel.js";
import Note from "../models/noteModel.js";
import mongoose from "mongoose";
import myError from "../function/error.js";
import checkId from "../function/checkId.js";

const tagSeach = async (query, userId) => {
  try {
    query.owner = userId;
    if (query.name) {
      query.name = {
        $regex: query.name,
        $options: "i",
      };
    }
    const tagArray = await Tag.find(query, "name").populate(
      "owner",
      "username"
    );
    return tagArray;
  } catch (error) {
    throw error;
  }
};

const tagSeachOrCreate = async (tagName, userId) => {
  try {
    console.log(tagName);
    let tag = await Tag.findOne({ name: tagName, owner: userId }, {
      __v: 0,
    });
    if (!tag) {
      tag = new Tag({
        name: tagName,
        owner: userId
      });
      await tag.save();
    }

    return tag;
  } catch (error) {
    throw error;
  }
};

// const tagCreate = async (body, userId) => {
//   try {
//     const { name } = body;
//     const newTag = new Tag({
//       name,
//       owner: userId,
//     });
//     const savedTag = await newTag.save();
//     return savedTag;
//   } catch (error) {
//     throw error;
//   }
// };

const tagEditById = async (tagId, body, userId) => {
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

    const newTag = await Tag.findByIdAndUpdate(tagId, body, { new: true })
      .populate("note", "title")
      .populate("owner", "username");
    return newTag;
  } catch (error) {
    throw error;
  }
};

const tagAddNoteById = async (tag, noteId, userId) => {
  try {
    if (!noteId) {
      throw myError.errorStatus("please provide noteId", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw myError.errorStatus("Invaild id", 400);
    }

    const note = await Note.findById(noteId, {
      __v: 0,
    });

    if (!note) {
      throw myError.errorStatus("note not found", 404);
    }
    const hasViewPermission =
      note.owner.equals(userId) ||
      note.editer.some((editorId) => editorId.equals(userId)) ||
      note.viewer.some((viewerId) => viewerId.equals(userId));
    if (!hasViewPermission) {
      throw myError.errorStatus(
        "You do not have permission to edit this note.",
        403
      );
    }

    const tagId = tag._id;

    await Note.findByIdAndUpdate(noteId, {
      $addToSet: {
        tag: tagId,
      },
    });

    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      {
        $addToSet: {
          note: noteId,
        },
      },
      { new: true }
    )

    return true;
  } catch (error) {
    throw error;
  }
};

export default {
  tagSeach,
  // tagSeachById,
  // tagCreate,
  tagSeachOrCreate,
  tagEditById,
  tagAddNoteById,
};
