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

    console.log("--> Gmail Service Modu Başlatılıyor...");

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Port ve Host ayarını sildik, direkt bunu kullanıyoruz.
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            },
            family: 4, // Bunu MUTLAKA tutuyoruz, Render için şart.
            logger: true, // Logları görelim
            debug: true   // Hata ayıklama açık
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

        console.log("--> Gönderim deneniyor...");
        let info = await transporter.sendMail(mailOptions);
        console.log("--> SONUÇ BAŞARILI: " + info.response);
        
        res.send(`
            <script>
                alert("Mesajınız başarıyla gönderildi!");
                window.location.href = "/contact"; 
            </script>
        `);

    } catch (error) {
        console.error("--> HATA (Service Modu):");
        console.error(error); 
        
        res.send(`
            <script>
                alert("Hata oluştu. Lütfen tekrar deneyin.");
                window.location.href = "/contact"; 
            </script>
        `);
    }
});

router.use("/about", (req, res) => { res.render('users/about', { navbarLinks }); });
router.use("/whereami", (req, res) => { res.render('users/whereami.ejs', { navbarLinks }); });
router.use("/", (req, res) => { res.render('users/homepage.ejs', { navbarLinks }); });

module.exports = router;