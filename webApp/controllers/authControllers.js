const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require('fs');
const path = require('path');


require("dotenv").config();





const login = (args) => {
  const filePath = path.join(__dirname , "../model/db.json");
  console.log(filePath);
  var data = fs.readFileSync(filePath , 'utf8');
  const usersArray = JSON.parse(data);
  console.log(usersArray);
  
  const check = usersArray.find(e => args.author.email === e.email);
  console.log("args");
  console.log(args);

  if (check) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(args.author.password, check.password, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result) {
          let token = jwt.sign(
            { Name: check.name },
            process.env.SECRET_KEY,
            {
              expiresIn: "60h",
            }
          );
          resolve({ success: true, token, redirect: "/home" }); // Include redirect information
        } else {
          reject(new Error("Invalid email or password"));
        }
      });
    });
  } else {
    throw new Error("User not found");
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
