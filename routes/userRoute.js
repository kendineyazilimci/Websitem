const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");
const nodemailer = require('nodemailer');
require('dotenv').config();

const navbarLinks = [
    {id: 2, name: "İletişim", url: "/contact"},
    {id: 3, name: "Hakkımda", url: "/about"},
    {id: 4, name: "Neredeyim?", url: "/whereami"}
];

router.get("/contact", (req, res) => {
    res.render('users/contact', { navbarLinks });
});

router.post("/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // 587 için false
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            family: 4, // IPv4 zorlaması (Timeout hatasını çözen kısım)
        });

        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`, 
            to: process.env.EMAIL_USER,
            replyTo: email, 
            subject: `Siteden Mesaj: ${subject}`,
            html: `
                <h3>Yeni İletişim Formu Mesajı</h3>
                <p><strong>Gönderen:</strong> ${name}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p><strong>Konu:</strong> ${subject}</p>
                <p><strong>Mesaj:</strong> <br>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        res.send(`
            <script>
                alert("Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.");
                window.location.href = "/contact"; 
            </script>
        `);

    } catch (error) {
        console.error("Mail hatası:", error);
        res.send(`
            <script>
                alert("Hata oluştu: Mesaj gönderilemedi.");
                window.location.href = "/contact"; 
            </script>
        `);
    }
});

router.use("/about", (req, res, next) => { 
    res.render('users/about', { navbarLinks }); 
});

router.use("/whereami", (req, res, next) => {
    res.render('users/whereami.ejs', { navbarLinks });
});

router.use("/", (req, res, next) => {
    res.render('users/homepage.ejs', { navbarLinks });
});

module.exports = router;