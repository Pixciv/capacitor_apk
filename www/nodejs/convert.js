const fs = require('fs');
const path = require('path');
const officeToPdf = require('office-to-pdf');

// DOCX, PPTX, XLSX → PDF dönüştürme fonksiyonu
async function convertFileToPDF(inputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    const outputPath = inputPath.replace(ext, '.pdf');
    
    // PDF ise direkt döndür
    if (ext === '.pdf') {
        return inputPath;
    }
    
    try {
        // Dosyayı oku
        const fileData = fs.readFileSync(inputPath);
        
        // Office belgesini PDF'e dönüştür
        const pdfBuffer = await officeToPdf(fileData);
        
        // PDF'i diske yaz
        fs.writeFileSync(outputPath, pdfBuffer);
        
        return outputPath;
    } catch (err) {
        console.error('Dönüştürme hatası:', err);
        throw err;
    }
}

// Node.js Mobile global export
global.convertFileToPDF = convertFileToPDF;

// Dosya sistemi işlemleri için yardımcı fonksiyonlar
global.fs = {
    readFile: (filePath, callback) => {
        fs.readFile(filePath, (err, data) => {
            callback(err, data);
        });
    },
    writeFile: (filePath, data, callback) => {
        fs.writeFile(filePath, data, (err) => {
            callback(err);
        });
    }
};
