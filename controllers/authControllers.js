const User = require("../model/AuthorSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


require("dotenv").config();




const login = (req, res, next) => {
  User.findOne({ Name: req.body.username_log })
    .then((user) => {
      if (user) {
        if (!user.verified) {
          res.status(403).json({
            status: "failed",
            message: "Email is not verified",
          });
        } else {
          bcrypt.compare(
            req.body.password_log,
            user.Password,
            function (err, result) {
              if (err) {
                res.status(403).json({
                  error: err,
                });
              }
              if (result) {
                let token = jwt.sign(
                  { Id: user.id, Name: user.Name, Role: user.role },
                  process.env.SECRET_KEY,
                  {
                    expiresIn: "30h",
                  }
                );
                res.cookie("token", token);
                res.status(200).json({
                  message: "login successfully !",
                  token: token,
                  role: user.role,
                  tutorial: user.tutorial,
                });
              } else {
                res.status(403).json({
                  message: "Username or Password is incorrect",
                });
              }
            }
          );
        }
      } else {
        res.status(404).json({
          message: "Username or Password is incorrect",
        });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};



module.exports = {
  
  login,

};
