function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    return res.render("login", {title: "Login", error: {message: "please login first"}})
  }
}

export default {
  requireLogin,
};
