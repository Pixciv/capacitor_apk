// Uygulama durumu
const state = {
    currentPdfPath: null,
    currentFileName: null
};

// DOM elementleri
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const conversionStatus = document.getElementById('conversionStatus');
const viewerContainer = document.getElementById('viewerContainer');
const pdfViewer = document.getElementById('pdfViewer');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const downloadBtn = document.getElementById('downloadBtn');
const newFileBtn = document.getElementById('newFileBtn');

// PDF.js ayarları
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Event listeners
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    // Dosya yükleme alanı tıklama olayı
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Dosya seçme olayı
    fileInput.addEventListener('change', handleFileSelect);
    
    // Sürükle bırak olayları
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    // İndir butonu
    downloadBtn.addEventListener('click', downloadPdf);
    
    // Yeni dosya butonu
    newFileBtn.addEventListener('click', resetApp);
}

// Dosya seçildiğinde
function handleFileSelect(e) {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
}

// Dosya işleme
async function handleFile(file) {
    // Dosya tipi kontrolü
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-excel',
        'application/pdf'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(docx|pptx|xlsx|doc|ppt|xls|pdf)$/i)) {
        showError('Desteklenmeyen dosya formatı. Lütfen DOCX, PPTX, XLSX veya PDF dosyası yükleyin.');
        return;
    }
    
    try {
        // UI güncelleme
        uploadArea.classList.add('hidden');
        conversionStatus.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
        // Dosya bilgilerini sakla
        state.currentFileName = file.name.replace(/\.[^/.]+$/, "") + '.pdf';
        
        // Node.js Mobile backend'e dosya yolunu gönder
        const pdfPath = await window.NodeJsMobile.convertFileToPDF(file.path);
        
        // Dönüşüm başarılı
        state.currentPdfPath = pdfPath;
        
        // PDF'i görüntüle
        await displayPdf(pdfPath);
        
        // UI güncelleme
        conversionStatus.classList.add('hidden');
        viewerContainer.classList.remove('hidden');
        
    } catch (error) {
        console.error('Dönüştürme hatası:', error);
        showError('Dosya dönüştürülürken bir hata oluştu: ' + error.message);
        resetUI();
    }
}

// PDF görüntüleme
async function displayPdf(pdfPath) {
    try {
        // PDF.js ile PDF'i yükle ve render et
        const pdfData = await readFileAsArrayBuffer(pdfPath);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        
        // Önceki içeriği temizle
        pdfViewer.innerHTML = '';
        
        // Her sayfayı render et
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const pageDiv = document.createElement('div');
            pageDiv.className = 'pdf-page';
            
            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            pageDiv.appendChild(canvas);
            pdfViewer.appendChild(pageDiv);
        }
    } catch (error) {
        console.error('PDF görüntüleme hatası:', error);
        throw new Error('PDF görüntülenirken bir hata oluştu.');
    }
}

// Dosyayı ArrayBuffer olarak okuma (Node.js Mobile için)
function readFileAsArrayBuffer(filePath) {
    return new Promise((resolve, reject) => {
        window.NodeJsMobile.fs.readFile(filePath, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

// PDF indirme
function downloadPdf() {
    if (!state.currentPdfPath) return;
    
    // Node.js Mobile üzerinden dosya indirme
    window.NodeJsMobile.fs.readFile(state.currentPdfPath, (error, data) => {
        if (error) {
            showError('Dosya indirilirken bir hata oluştu: ' + error.message);
            return;
        }
        
        // Blob oluştur ve indir
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = state.currentFileName;
        document.body.appendChild(a);
        a.click();
        
        // Temizlik
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    });
}

// Hata gösterimi
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

// UI sıfırlama
function resetUI() {
    conversionStatus.classList.add('hidden');
    viewerContainer.classList.add('hidden');
    uploadArea.classList.remove('hidden');
    fileInput.value = '';
}

// Uygulamayı sıfırlama
function resetApp() {
    resetUI();
    state.currentPdfPath = null;
    state.currentFileName = null;
}

// Node.js Mobile hazır olduğunda
document.addEventListener('deviceready', function() {
    console.log('Node.js Mobile hazır');
}, false);
