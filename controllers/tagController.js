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

const tagSeachById = async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await tagHandler.tagSeachById(tagId, req.session.userId);
    return res.status(200).json(tag);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

const tagCreate = async (req, res) => {
  try {
    console.log(req.body);
    const tag = await tagHandler.tagCreate(req.body, req.session.userId);
    return res.status(200).json(tag);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

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

const tagAddNoteById = async (req, res) => {
  try {
    const tagId = req.params.id;
    const { noteIdArray } = req.body;
    const tag = await tagHandler.tagAddNoteById(
      tagId,
      noteIdArray,
      req.session.userId
    );
    return res.status(200).json(tag);
  } catch (error) {
    return myError.errorReturn(res, error);
  }
};

export default {
  tagList,
  tagSeachById,
  tagCreate,
  tagEditById,
  tagAddNoteById,
};
