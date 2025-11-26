const express = require('express');
const router = express.Router();
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

    console.log("Mail gönderme işlemi başladı..."); // Log 1

    // Şifreler okunabiliyor mu kontrolü (Güvenlik için sadece ilk 3 harfini basar)
    const userCheck = process.env.EMAIL_USER ? process.env.EMAIL_USER : "YOK";
    const passCheck = process.env.EMAIL_PASS ? "VAR" : "YOK";
    console.log(`ENV Kontrolü -> User: ${userCheck}, Pass: ${passCheck}`);

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            family: 4, 
            debug: true, // HATA AYIKLAMA MODU AÇIK
            logger: true // LOGLARI KONSOLA BAS
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

        console.log("Transporter oluşturuldu, mail gönderiliyor...");
        let info = await transporter.sendMail(mailOptions);
        console.log("Mail başarıyla gitti! ID: " + info.messageId);
        
        res.send(`
            <script>
                alert("Mesajınız başarıyla gönderildi!");
                window.location.href = "/contact"; 
            </script>
        `);

    } catch (error) {
        // HATANIN BABASINI BURADA GÖRECEĞİZ
        console.error("Mail GÖNDERİLEMEDİ. Hata Detayı:");
        console.error(error); 
        
        res.send(`
            <script>
                alert("Hata oluştu: Mesaj gönderilemedi. Hata: ${error.message}");
                window.location.href = "/contact"; 
            </script>
        `);
    }
});

router.use("/about", (req, res) => { res.render('users/about', { navbarLinks }); });
router.use("/whereami", (req, res) => { res.render('users/whereami.ejs', { navbarLinks }); });
router.use("/", (req, res) => { res.render('users/homepage.ejs', { navbarLinks }); });

module.exports = router;