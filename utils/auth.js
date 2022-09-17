const withAuth = (req, res, next) => {
  console.log('heloooooooooo', req.session.userId)
    if (!req.session.userId) {
      res.redirect("/login");
    } else {
      next();
    }
  };
  
  module.exports = withAuth;
  