const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const ExcelJS = require("exceljs");
const PPTXParser = require("pptx-parser");

async function convertDocxToHtml(filePath) {
    try {
        const result = await mammoth.convertToHtml({ path: filePath });
        return result.value;
    } catch (err) {
        console.error("DOCX to HTML conversion error:", err);
        return "<p>DOCX conversion failed</p>";
    }
}

async function convertXlsxToHtml(filePath) {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        let html = "<table border='1'>";
        workbook.eachSheet((sheet) => {
            sheet.eachRow((row) => {
                html += "<tr>";
                row.eachCell((cell) => {
                    html += `<td>${cell.value || ''}</td>`;
                });
                html += "</tr>";
            });
        });
        html += "</table>";
        return html;
    } catch (err) {
        console.error("XLSX to HTML conversion error:", err);
        return "<p>XLSX conversion failed</p>";
    }
}

async function convertPptxToHtml(filePath) {
    try {
        const presentation = await PPTXParser.parse(filePath);
        let html = "<div class='ppt'>";
        presentation.slides.forEach((slide, index) => {
            html += `<div class='slide' id='slide-${index + 1}'>`;
            slide.texts.forEach((textObj) => {
                html += `<p>${textObj.text}</p>`;
            });
            html += "</div>";
        });
        html += "</div>";
        return html;
    } catch (err) {
        console.error("PPTX to HTML conversion error:", err);
        return "<p>PPTX conversion failed</p>";
    }
}

async function convertOfficeToHtml(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".docx") return await convertDocxToHtml(filePath);
    if (ext === ".xlsx") return await convertXlsxToHtml(filePath);
    if (ext === ".pptx") return await convertPptxToHtml(filePath);
    return "<p>Unsupported file type</p>";
}

// Node.js Mobile plugin ile kullanılacak
module.exports = { convertOfficeToHtml };
