import noteHandler from "../handlers/noteHandler.js";
import myError from "../function/error.js";

const noteList = async (req, res) => {
  try {
    const { title } = req.query;
    const note = await noteHandler.noteSeach({ title }, req.session.userId);
    return res.status(200).json(note);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

const viewNoteSeachById = async (req, res) => {
  try {
    const userId = req.session.userId;
    const noteId = req.params.id;
    const note = await noteHandler.noteSeachById(noteId, userId);
    return res.render("noteView", { note });
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

const noteCreate = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.session.userId;
    const note = await noteHandler.noteCreate(title, userId);
    return res.redirect(`/protected/view/notes/${note._id}`);
    return res.status(200).json(note);
  } catch (error) {
    console.error(error);
    return myError.errorReturn(res, error);
  }
};

const noteEditContentById = async (req, res) => {
  try {
    const userId = req.session.userId;
    const noteId = req.params.id;
    const note = await noteHandler.noteUpdateContentById(
      noteId,
      userId,
      req.body
    );
    return res.status(200).json(note);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

const noteDeleteById = async (req, res) => {
  try {
    console.log("backend sever delete note id: ", req.params.id)
    const userId = req.session.userId;
    const noteId = req.params.id;
    const note = await noteHandler.noteDeleteById(noteId, userId);
    return res.status(200).json(note);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

export default {
  noteList,
  viewNoteSeachById,
  noteCreate,
  noteEditContentById,
  noteDeleteById,
};
