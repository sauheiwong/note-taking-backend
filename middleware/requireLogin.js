function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    return res
      .status(401)
      .json({ message: "unauthorized, please log in first" });
  }
}

module.exports = requireLogin;
