import mongoose from "mongoose";
import myError from "../function/error.js";

function isVaildIdArray(idArray) {
  if (idArray.length === 0) {
    return true;
  }
  for (let id of idArray) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
  }
  return true;
}

export default {
  isVaildIdArray,
};
