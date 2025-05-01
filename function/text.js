function textTrimToLower(req, text) {
  text = req.body[`${text}`];
  return text.trim().toLowerCase();
}

module.exports = { textTrimToLower };
