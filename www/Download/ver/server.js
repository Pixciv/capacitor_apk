const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 'pdfdoc' klasörünün varlığını kontrol et, yoksa oluştur
const uploadDir = path.join(__dirname, 'pdfdoc');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer ile dosya yükleme ayarları
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        let fileName = file.originalname;
        const fileNameWithoutExt = path.parse(fileName).name;
        const fileExt = path.parse(fileName).ext;
        let counter = 1;

        // Dosya adı çakışmasını kontrol etme
        while (fs.existsSync(path.join(uploadDir, fileName))) {
            fileName = `${fileNameWithoutExt}(${counter})${fileExt}`;
            counter++;
        }
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

app.use(express.static(__dirname)); // Statik dosyaları sunar (index.html, web klasörü vb.)

app.post('/upload', upload.single('pdfFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Dosya yüklenemedi.');
    }
    console.log(`Dosya başarıyla yüklendi: ${req.file.filename}`);
    res.status(200).json({ fileName: req.file.filename, url: `/pdfdoc/${req.file.filename}` });
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});

