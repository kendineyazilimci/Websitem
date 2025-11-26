const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

const navbarLinks = [
    {id: 2, name: "İletişim", url: "/contact"},
    {id: 3, name: "Hakkımda", url: "/about"},
    {id: 4, name: "Neredeyim?", url: "/whereami"}
];

router.get("/contact", (req, res) => { res.render('users/contact', { navbarLinks }); });

router.post("/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log("--> Outlook ile gönderim deneniyor...");

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS  
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: process.env.EMAIL_USER,
            subject: `Siteden Mesaj: ${subject}`,
            text: `Gönderen: ${name} (${email})\n\nMesaj:\n${message}`
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("--> BAŞARILI! ID: " + info.messageId);
        
        res.send(`<script>alert("Gönderildi!"); window.location.href = "/contact";</script>`);

    } catch (error) {
        console.error("HATA:", error);
        res.send(`<script>alert("Hata: ${error.message}"); window.location.href = "/contact";</script>`);
    }
});
module.exports = router;