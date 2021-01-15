const passport = require('passport');

module.exports = (req, res, next) => {
  //console.log(req.isAuthenticated);
  if (req.user.isSuperAdmin) {
      return next();
  }
  req.flash("message-warning", "Only super admin can do this!");
  return res.redirect(req.get("referer"));
}