const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username, password} = req.body

    if (username && password) {
        if (isValid(username)){
            users.push({"username": username, "password": password});
        }

        return res.status(200).json({message: "User created successfully"});
    } else {
        return res.status(404).json({message: "User already exists"})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]){
        res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book is not available"})
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const requestedAuthor = req.params.author
    const booksKeys = Object.keys(books);
    let matches = []

  booksKeys.forEach((key) => {
    if (books[key].author.toLowerCase() === requestedAuthor.toLowerCase()){
        matches.push(books[key]);
    }});

    if (matches.length > 0) {
        res.send(matches)
    } else {
        res.status(404).send("Author not found")
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = req.params.title
    const booksKeys = Object.keys(books);
    let matches = []

  booksKeys.forEach((key) => {
    if (books[key].title.toLowerCase() === requestedTitle.toLowerCase()){
        matches.push(books[key]);
    }});

    if (matches.length > 0) {
        res.send(matches)
    } else {
        res.status(404).send("Title not found")
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) res.status(404).send("Book not available")
    
    if (Object.keys(books[isbn].reviews).length > 0){
        res.send(books[isbn].reviews);
    } else {
        res.send("No reviews for this book");
    }
});

module.exports.general = public_users;
