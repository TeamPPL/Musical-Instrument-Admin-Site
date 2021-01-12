const passport = require('passport');

module.exports = (req, res, next) => {
  //console.log(req.isAuthenticated);
  if (req.isAuthenticated()) {
      return next();
  }
  req.flash("message-warning", "You need to login in order to continue.")
  res.redirect("/admin/login");
}