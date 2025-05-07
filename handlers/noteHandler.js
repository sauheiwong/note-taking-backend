import Note from "../models/noteModel.js";
import mongoose from "mongoose";
import myError from "../function/error.js";

const noteSeach = async (query, userId) => {
  try {
    query["$or"] = [
      { owner: userId },
      { editer: { $in: [userId] } },
      { viewer: { $in: [userId] } },
    ];
    const note = await Note.find(
      query,
      "_id owner title tag updatedAt"
    ).populate("owner", "username");
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
      __v: 0,
    })
      .populate("owner", "username")
      .populate("editer", "username")
      .populate("viewer", "username");
    if (!note) {
      throw myError.errorStatus("note not found", 404);
    }

    const hasViewPermission =
      note.owner.equals(userId) ||
      note.editer.some((editorId) => editorId.equals(userId)) ||
      note.viewer.some((viewerId) => viewerId.equals(userId));
    if (!hasViewPermission) {
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

const noteCreate = async (title, userId) => {
  try {
    const newNote = new Note({
      title,
      owner: userId,
    });
    const savedNote = await newNote.save();
    return savedNote;
  } catch (error) {
    throw error;
  }
};

const noteUpdateContentById = async (noteId, userId, body) => {
  try {
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
      note.editer.some((editorId) => editorId.equals(userId));
    if (!hasViewPermission) {
      throw myError.errorStatus(
        "You do not have permission to edit this note.",
        403
      );
    }

    const { title, content } = body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("owner", "username")
      .populate("editer", "username")
      .populate("viewer", "username");

    return updatedNote;
  } catch (error) {
    throw error;
  }
};

const noteAddEditerViewerById = async (noteId, userId, body) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw myError.errorStatus("Invaild id", 400);
    }

    const note = await Note.findById(noteId, {
      __v: 0,
    });
    if (!note) {
      throw myError.errorStatus("note not found", 404);
    }

    const hasViewPermission = note.owner.equals(userId);
    if (!hasViewPermission) {
      throw myError.errorStatus(
        "You do not have permission to edit this note.",
        403
      );
    }

    let { editers, viewers } = body;
    if (!editers) {
      editers = [];
    }
    if (!viewers) {
      viewers = [];
    }
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        $addToSet: {
          editer: { $each: editers },
          viewer: { $each: viewers },
        },
      },
      { new: true }
    )
      .populate("owner", "username")
      .populate("editer", "username")
      .populate("viewer", "username");

    return updatedNote;
  } catch (error) {
    throw error;
  }
};

const noteRemoveEditerViewerById = async (noteId, userId, body) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw myError.errorStatus("Invaild id", 400);
    }

    const note = await Note.findById(noteId, {
      __v: 0,
    });
    if (!note) {
      throw myError.errorStatus("note not found", 404);
    }

    const hasViewPermission = note.owner.equals(userId);
    if (!hasViewPermission) {
      throw myError.errorStatus(
        "You do not have permission to edit this note.",
        403
      );
    }

    let { editers, viewers } = body;
    console.log(viewers);
    if (!editers) {
      editers = [];
    }
    if (!viewers) {
      viewers = [];
    }
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        $pull: {
          editer: { $in: editers },
          viewer: { $in: viewers },
        },
      },
      { new: true }
    )
      .populate("owner", "username")
      .populate("editer", "username")
      .populate("viewer", "username");

    return updatedNote;
  } catch (error) {
    throw error;
  }
};

export default {
  noteSeach,
  noteSeachById,
  noteCreate,
  noteUpdateContentById,
  noteAddEditerViewerById,
  noteRemoveEditerViewerById,
};
