const fileInput = document.getElementById("fileInput");
const htmlContainer = document.getElementById("htmlContainer");

fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Node.js Mobile path (Android/iOS ortamına göre)
    const filePath = file.path || file.name;

    try {
        const html = await global.convertOfficeToHtml(filePath);
        htmlContainer.innerHTML = html;
    } catch (err) {
        htmlContainer.innerHTML = `<p>Error: ${err}</p>`;
    }
});
