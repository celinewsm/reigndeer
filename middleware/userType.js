module.exports = function(req, res, next) {
  if (req.user.type === "client") {
    res.redirect('/client/');
  } else if (req.user.type === "courier") {
    res.redirect('/courier/')
  } else {
    next();
  }
};
