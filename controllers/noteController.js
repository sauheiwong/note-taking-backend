import noteHandler from "../handlers/noteHandler.js";
import myError from "../function/error.js";

const noteList = async (req, res) => {
  try {
    const query = req.query;
    const note = await noteHandler.noteSeach(query, req.session.userId);
    return res.status(200).json(note);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

const noteSeachById = async (req, res) => {
  try {
    const userId = req.session.userId;
    const noteId = req.params.id;
    const note = await noteHandler.noteSeachById(noteId, userId);
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

const noteAddEditerViewerById = async (req, res) => {
  try {
    const userId = req.session.userId;
    const noteId = req.params.id;
    const note = await noteHandler.noteAddEditerViewerById(
      noteId,
      userId,
      req.body
    );
    return res.status(200).json(note);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

const noteRemoveEditerViewerById = async (req, res) => {
  try {
    const userId = req.session.userId;
    const noteId = req.params.id;
    const note = await noteHandler.noteRemoveEditerViewerById(
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
  noteSeachById,
  viewNoteSeachById,
  noteCreate,
  noteEditContentById,
  noteAddEditerViewerById,
  noteRemoveEditerViewerById,
  noteDeleteById,
};
