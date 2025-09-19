import { NodeJS } from 'capacitor-nodejs';

const fileInput = document.getElementById("fileInput");
const htmlContainer = document.getElementById("htmlContainer");

fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Android/iOS ortamında dosya path'i
    const filePath = file.path || file.name;

    try {
        // NodeJS plugin ile convert.js'i çağır
        const result = await NodeJS.eval({
            script: `
                const { convertOfficeToHtml } = require('./convert.js');
                convertOfficeToHtml("${filePath}")
            `
        });

        htmlContainer.innerHTML = result.result; // plugin eval sonucu .result içinde gelir
    } catch (err) {
        htmlContainer.innerHTML = `<p>Error: ${err}</p>`;
        console.error(err);
    }
});
