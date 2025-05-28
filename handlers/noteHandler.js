import Note from "../models/noteModel.js";
import Tag from "../models/tagModel.js";
import mongoose from "mongoose";
import myError from "../function/error.js";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const noteSeach = async ({ title }, userId) => {
  try {
    const query = { owner: userId };

    if (title){
      query.title = { $regex: title, $options: "i"} // i means case-insensitive
    };

    const noteArray = await Note.find(query, "_id owner title updatedAt")
      .populate("owner", "username")

    return noteArray;
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
      .populate("viewer", "username")
      .populate("tag", "name owner");
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
    // Filter tags to only include the user's own tags
    if (note.tag) {
      note.tag = note.tag.filter((tag) => tag.owner.equals(userId));
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

    let { title, content } = body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) {
      content = DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true }
      })
      updateData.content = content
    }
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

// const noteAddEditerViewerById = async (noteId, userId, body) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(noteId)) {
//       throw myError.errorStatus("Invaild id", 400);
//     }

//     const note = await Note.findById(noteId, {
//       __v: 0,
//     });
//     if (!note) {
//       throw myError.errorStatus("note not found", 404);
//     }

//     const hasViewPermission = note.owner.equals(userId);
//     if (!hasViewPermission) {
//       throw myError.errorStatus(
//         "You do not have permission to edit this note.",
//         403
//       );
//     }

//     let { editers, viewers } = body;
//     if (!editers) {
//       editers = [];
//     }
//     if (!viewers) {
//       viewers = [];
//     }
//     if (!(checkId.isVaildIdArray(editers) && checkId.isVaildIdArray(viewers))) {
//       throw myError.errorStatus("Invaild id", 400);
//     }
//     const updatedNote = await Note.findByIdAndUpdate(
//       noteId,
//       {
//         $addToSet: {
//           editer: { $each: editers },
//           viewer: { $each: viewers },
//         },
//       },
//       { new: true }
//     )
//       .populate("owner", "username")
//       .populate("editer", "username")
//       .populate("viewer", "username");

//     return updatedNote;
//   } catch (error) {
//     throw error;
//   }
// };

// const noteRemoveEditerViewerById = async (noteId, userId, body) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(noteId)) {
//       throw myError.errorStatus("Invaild id", 400);
//     }

//     const note = await Note.findById(noteId, {
//       __v: 0,
//     });
//     if (!note) {
//       throw myError.errorStatus("note not found", 404);
//     }

//     const hasViewPermission = note.owner.equals(userId);
//     if (!hasViewPermission) {
//       throw myError.errorStatus(
//         "You do not have permission to edit this note.",
//         403
//       );
//     }

//     let { editers, viewers } = body;
//     console.log(viewers);
//     if (!editers) {
//       editers = [];
//     }
//     if (!viewers) {
//       viewers = [];
//     }
//     if (!(checkId.isVaildIdArray(editers) && checkId.isVaildIdArray(viewers))) {
//       throw myError.errorStatus("Invaild id", 400);
//     }
//     const updatedNote = await Note.findByIdAndUpdate(
//       noteId,
//       {
//         $pull: {
//           editer: { $in: editers },
//           viewer: { $in: viewers },
//         },
//       },
//       { new: true }
//     )
//       .populate("owner", "username")
//       .populate("editer", "username")
//       .populate("viewer", "username");

//     return updatedNote;
//   } catch (error) {
//     throw error;
//   }
// };

const noteDeleteById = async (noteId, userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw myError.errorStatus("Invaild id", 400);
    }

    const note = await Note.findById(noteId);
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
    for (let tag of note.tag) {
      const tagId = tag._id;
      await Tag.findByIdAndUpdate(tagId, {
        $pull: {
          note: noteId,
        },
      });
    }
    const deleteNote = await Note.findOneAndDelete({ _id: noteId });
    return deleteNote;
  } catch (error) {
    throw error;
  }
};

export default {
  noteSeach,
  noteSeachById,
  noteCreate,
  noteUpdateContentById,
  // noteAddEditerViewerById,
  // noteRemoveEditerViewerById,
  noteDeleteById,
};
