function res404(res, objectName, targetName) {
  return res
    .status(404)
    .json({ message: `${objectName} ${targetName} not found` });
}

function res400(res, objectName) {
  return res.status(400).json({ message: `please provide ${objectName} id` });
}

function res400InvaildId(res, objectName) {
  return res.status(400).json({ message: `Invalid ${objectName} id format` });
}

function res403(res) {
  return res
    .status(403)
    .json({ message: "You do not have permission to do it" });
}

module.exports = { res404, res400, res400InvaildId, res403 };
