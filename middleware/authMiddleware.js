const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  //return next();
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      
      req.userId = decode.Id
      req.userName = decode.Name
      
      next();
    
    } catch (error) {
      res.status(401);
      //throw new Error("Not authorized, token failed");
      res.redirect("/login")
    }
  }

  if (!token) {
    res.status(401);
    //throw new Error("Not authorized, no token");
    res.redirect("/login")
  }
});

module.exports =  protect ;
