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
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {accessToken, username}
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid credentials"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];

  // Check if book exists
  if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
  }

  // Check if review content is provided
  if (!review) {
      return res.status(400).json({message: "Review content missing"});
  }

  // Add or modify the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
      message: "Review successfully posted", 
      reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        
        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({message: "Review not found for this user"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
