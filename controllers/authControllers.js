const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require('fs');
const path = require('path');


require("dotenv").config();




const login1 = (req, res, next) => {
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

const login = (req, res, next) => {
  const filePath = path.join(__dirname , "../model/db.json")
  console.log(filePath)
  var data = fs.readFileSync(filePath , 'utf8');
  const usersArray = JSON.parse(data);
  console.log(usersArray)
  const check = usersArray.find(e => req.body.email == e.email)
  console.log(check)
  if(check)
  {
    bcrypt.compare(req.body.password , check.password , (err,result) => {
      if (err) {
        res.status(403).json({
          error: err,
        });
      }
      if (result) {
        
        let token = jwt.sign(
          {Name: check.name},
          process.env.SECRET_KEY,
          {
            expiresIn: "60h",
          }
        );
        res.cookie("token", token);
        console.log("home")
        res.redirect("/home")
      } else {
        res.redirect("/login")
      }
    }
    )

  }
  else
  {
    return res.status(404).json({
      message : "Email or Password is incorrect !"
    })
  }

};

const register = async(args) => {
  

// Path to the JSON file
const filePath = path.join(__dirname, '../model/db.json');
console.log(args)
// New user object
var hashedPassword = await bcrypt.hash(args.author.password , 10)
const newUser = {
name : args.author.name ,
email : args.author.email ,
password : hashedPassword

};

// Read the JSON file
const data = fs.readFileSync(filePath, 'utf8')


try {
  // Parse JSON data to an array
  const usersArray = JSON.parse(data);

  // Add the new user to the array
  usersArray.push(newUser);
  
  // Write the updated array back to the JSON file
 fs.writeFileSync(filePath, JSON.stringify(usersArray, null, 2), 'utf8')
  console.log(usersArray)
  return usersArray

} catch (parseErr) {
  console.error('Error parsing JSON data:', parseErr);
}
}

const displayUsers = (params) => {

  const filePath = path.join(__dirname , "../model/db.json")
  console.log(filePath)
  const data = fs.readFileSync(filePath , 'utf8');

  

  try {
    // Parse JSON data to an array
    const usersArray = JSON.parse(data);
    
    // Add the new user to the array
    return usersArray ; 

    // Write the updated array back to the JSON file
  } catch (parseErr) {
    console.error('Error parsing JSON data:', parseErr);
  }
  
}





module.exports = {
  
  login,
  register,
  displayUsers

};
