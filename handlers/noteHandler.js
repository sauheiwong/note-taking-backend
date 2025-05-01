import Note from "../models/noteModel.js";
import mongoose from "mongoose";
import myError from "../function/error.js";

const noteSeach = async (query) => {
  try {
    const note = await Note.find(query, "_id title tag updatedAt");
    return note;
  } catch (error) {
    throw error;
  }
};

const noteSeachById = async (noteId, userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw myError.errorStatus("Invaild id", 400);
    }

    const note = await Note.findById(noteId, {
      content: 0,
      __v: 0,
    });
    if (!note) {
      throw myError.errorStatus("note not found", 404);
    }
    if (
      !(
        note.owner.equals(userId) ||
        note.editer.some((editorId) => editorId.equals(userId)) ||
        note.viewer.some((viewerId) => viewerId.equals(userId))
      )
    ) {
      throw myError.errorStatus(
        "You do not have permission to read this note.",
        403
      );
    }

    return note;
  } catch (error) {
    throw error;
  }
};

export default {
  noteSeach,
  noteSeachById,
};
