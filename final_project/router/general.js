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
public_users.get('/', async function (req, res) {
    try {
        const bookList = await Promise.resolve(books)
        res.send(JSON.stringify(books,null,4))
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Unable to retieve books at the moment"})
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const book = await Promise.resolve(books[isbn]);

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not available" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Unable to retrieve book details at the moment"})
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const requestedAuthor = req.params.author.toLowerCase();
    try {
        const allBooks = await Promise.resolve(books);
        const booksKeys = Object.keys(allBooks);
        let matches = [];

        booksKeys.forEach((key) => {
            if (allBooks[key].author.toLowerCase() === requestedAuthor) {
                matches.push(allBooks[key]);
            }
        });

        if (matches.length > 0) {
            res.status(200).json(matches);
        } else {
            res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const requestedTitle = req.params.title.toLowerCase();

    try {
        const allBooks = await Promise.resolve(books);
        const booksKeys = Object.keys(allBooks);
        let matches = [];

        booksKeys.forEach((key) => {
            if (allBooks[key].title.toLowerCase() === requestedTitle) {
                matches.push(allBooks[key]);
            }
        });

        if (matches.length > 0) {
            res.status(200).json(matches);
        } else {
            res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by title" });
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
