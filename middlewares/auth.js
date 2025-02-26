function checkUser(req, res, next) {
  const user = req.session.user;

  if (!user) {
    req.flash("error", "Please login.");
    return res.redirect("/login");
  }

  console.log("ada yang login nih", user);

  next();
}

module.exports = checkUser;
