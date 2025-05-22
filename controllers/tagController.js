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

// const tagSeachById = async (req, res) => {
//   try {
//     const tagId = req.params.id;
//     const tag = await tagHandler.tagSeachById(tagId, req.session.userId);
//     return res.status(200).json(tag);
//   } catch (error) {
//     return myError.errorReturn(res, error);
//   }
// };

// const tagCreate = async (req, res) => {
//   try {
//     console.log(req.body);
//     const tag = await tagHandler.tagCreate(req.body, req.session.userId);
//     return res.status(200).json(tag);
//   } catch (error) {
//     return myError.errorReturn(res, error);
//   }
// };

const tagEditById = async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await tagHandler.tagEditById(
      tagId,
      req.body,
      req.session.userId
    );
    return res.status(200).json(tag);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

const tagAddToNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.session.userId;
    const { tagName } = req.body;
    console.log("req.body is: ", req.body)
    const tag = await tagHandler.tagSeachOrCreate(tagName, userId);
    const isSuccess = await tagHandler.tagAddNoteById(tag, noteId, userId);
    return res.status(200).json({message: "ok"});
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

export default {
  tagList,
  // tagSeachById,
  // tagCreate,
  tagEditById,
  tagAddToNote,
};
