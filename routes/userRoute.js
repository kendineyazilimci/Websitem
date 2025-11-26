const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs"); 

const navbarLinks = [
    {id: 2, name: "İletişim", url: "/contact"},
    {id: 3, name: "Hakkımda", url: "/about"},
    {id: 4, name: "Neredeyim?", url: "/whereami"}
];

router.get("/", (req, res) => {
    res.render('users/homepage.ejs', { navbarLinks }); 
});

router.get("/contact", (req, res) => {
    res.render('users/contact', { navbarLinks });
});

router.get("/about", (req, res) => { 
    res.render('users/about', { navbarLinks }); 
});

router.get("/whereami", (req, res) => {
    res.render('users/whereami.ejs', { navbarLinks });
});

module.exports = router;