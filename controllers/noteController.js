import noteHandler from "../handlers/noteHandler.js";
import myError from "../function/error.js";

const noteList = async (req, res) => {
  try {
    const userId = req.session.userId;
    const query = req.query;
    query.owner = userId;
    const note = await noteHandler.noteSeach(query);
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
    console.error(error);
    return myError.errorReturn(res, error);
  }
};

export default {
  noteList,
  noteSeachById,
};
