import noteHandler from "../handlers/noteHandler.js";
import myError from "../function/error.js";

const homeView = async (req, res) => {
  const query = req.query;
  const notes = await noteHandler.noteSeach(query, req.session.userId);
  return res.render("homePage", { notes });
};

export default {
  homeView,
};
