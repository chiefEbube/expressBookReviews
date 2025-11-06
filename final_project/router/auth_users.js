const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let usersWithSameName = users.filter(user => user.username === username)

    if (usersWithSameName.length > 0) {
        return false
    } else {
        return true
    }
}

const authenticatedUser = (username,password)=>{
    let validUsers = users.filter(user => (user.username === username && user.password === password))
    if (validUsers.length > 0) return true
    else return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(404).json({message: "e"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
