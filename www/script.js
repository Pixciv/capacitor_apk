document.addEventListener('DOMContentLoaded', () => {
    // --- UI Element References ---
    const mainHeader = document.getElementById('main-header');
    const selectionHeader = document.getElementById('selection-header');
    const selectIcon = document.getElementById('select-icon');
    const selectionCancel = document.getElementById('selection-cancel');
    const selectionAll = document.getElementById('selection-all');
    const selectionDelete = document.getElementById('selection-delete');
    const selectionMove = document.getElementById('selection-move');
    const selectionShare = document.getElementById('selection-share');
    const selectionCount = document.getElementById('selection-count');
    const bottomNav = document.getElementById('main-bottom-nav');
    const fileListContent = document.getElementById('file-list-content');
    const favoritesListContent = document.getElementById('favorites-list-content');
    const recentListContent = document.getElementById('recent-list-content');
    const drawer = document.getElementById('drawer');
    const drawerToggle = document.getElementById('drawer-toggle');
    const backButton = document.getElementById('back-button');
    const headerTitle = document.getElementById('header-title');
    const overlay = document.getElementById('overlay');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const sortIcon = document.getElementById('sort-icon');
    const sortPopup = document.getElementById('sort-popup');
    const sortOptions = document.querySelectorAll('.sort-option');
    const searchIcon = document.getElementById('search-icon');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');
    const searchBack = document.getElementById('search-back');
    const searchClear = document.getElementById('search-clear');
    const headerIcons = document.querySelector('#main-header .header-icons');
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    const contentSections = document.querySelectorAll('.content-container .content');
    const fileMenuPopup = document.getElementById('file-menu-popup');
    const importFileItem = document.getElementById('import-file-item');
    const importFileInput = document.getElementById('import-file-input'); 
    const createFolderIcon = document.getElementById('create-folder-icon');
    const colorPickerPopup = document.getElementById('color-picker-popup');
    const colorGrid = document.querySelector('.color-grid');
    const colorCancelButton = document.getElementById('color-cancel');
    const movePopup = document.getElementById('move-popup');
    const moveListContent = document.getElementById('move-list-content');
    const moveCancelButton = document.getElementById('move-cancel');

    // --- State Variables ---
    let allFiles = [];
    let selectionMode = false;
    let selectedFiles = new Set();
    let currentSortCriteria = 'date-desc';
    let currentSearchTerm = '';
    let currentFolder = null; 
    let targetFolderForColor = null;

    // --- Kaydırma (Swipe) Hareketini Takip Etmek İçin Değişkenler ---
    let startX = 0;
    let endX = 0;
    const minSwipeDistance = 50; 

    // --- Local Storage Functions ---
    function loadFiles() {
        try {
            const storedFiles = localStorage.getItem('allFiles');
            return storedFiles ? JSON.parse(storedFiles) : [];
        } catch (e) {
            console.error('Failed to load files from local storage:', e);
            return [];
        }
    }

    function saveFiles() {
        try {
            localStorage.setItem('allFiles', JSON.stringify(allFiles));
        } catch (e) {
            console.error('Failed to save files to local storage:', e);
        }
    }

    // --- UI State Management ---
    function toggleDrawer(open) {
        drawer.classList.toggle('active', open);
        overlay.classList.toggle('active', open);
    }

    function toggleSelectionMode(enable) {
        selectionMode = enable;
        mainHeader.style.display = enable ? 'none' : 'flex';
        selectionHeader.style.display = enable ? 'flex' : 'none';
        bottomNav.style.display = enable ? 'none' : 'flex';
        document.body.classList.toggle('selection-mode', enable);

        if (!enable) {
            selectedFiles.clear();
        }

        renderCurrentContent();
        updateSelectionCount();
    }

    function updateSelectionCount() {
        const count = selectedFiles.size;
        selectionCount.textContent = `${count} Dosya Seçildi`;
        selectionDelete.style.display = count > 0 ? 'block' : 'none';
        selectionMove.style.display = count > 0 ? 'block' : 'none';
        selectionShare.style.display = count > 0 ? 'block' : 'none';
    }

    function showContent(navId) {
        contentSections.forEach(section => {
            section.classList.toggle('active', section.id === `${navId}-content`);
        });

        const isAllFiles = navId === 'all-files';
        headerTitle.textContent = isAllFiles ? 'Tüm Dosyalar' :
            navId === 'recent' ? 'Son Kullanılanlar' :
            navId === 'favorites' ? 'Favoriler' :
            navId === 'tools' ? 'Araçlar' : 'PDF Reader';

        drawerToggle.style.display = isAllFiles ? 'block' : 'none';
        backButton.style.display = isAllFiles ? 'none' : 'block';
        sortIcon.style.display = navId === 'recent' ? 'none' : 'block';
        searchIcon.style.display = 'block';
        createFolderIcon.style.display = 'block';

        toggleSelectionMode(false);
        renderCurrentContent();
    }

    // --- File Rendering and Actions ---
    function renderCurrentContent() {
        const activeNavId = document.querySelector('.bottom-nav .nav-item.active').getAttribute('data-nav');
        const targetElement = activeNavId === 'favorites' ? favoritesListContent : 
                             activeNavId === 'recent' ? recentListContent : 
                             fileListContent;

        let filesToRender = allFiles;

        // 1. Sekmeye Göre İlk Filtreleme
        if (activeNavId === 'favorites') {
            filesToRender = filesToRender.filter(item => item.isFavorite && !item.isFolder);
        } else if (activeNavId === 'all-files') {
             filesToRender = filesToRender.filter(item => item.parentFolder === currentFolder);
        } else if (activeNavId === 'recent') { 
            filesToRender = filesToRender.filter(item => !item.isFolder && item.lastOpened !== null);
        }

        // 2. Arama Filtreleme
        if (currentSearchTerm) {
            filesToRender = filesToRender.filter(item =>
                item.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
            );
        }

        // 3. Sıralama
        if (activeNavId === 'recent') { 
            filesToRender.sort((a, b) => {
                const dateA = new Date(a.lastOpened);
                const dateB = new Date(b.lastOpened);
                return dateB - dateA;
            });
        } else {
            filesToRender.sort(getSortFunction(currentSortCriteria));
        }
        
        // 4. Render Etme
        targetElement.innerHTML = '';
        
        if (filesToRender.length === 0) {
            targetElement.innerHTML = createEmptyStateHtml(currentSearchTerm);
            return;
        }

        const folders = filesToRender.filter(item => item.isFolder);
        const files = filesToRender.filter(item => !item.isFolder);

        if (activeNavId === 'all-files') {
            folders.forEach(folder => {
                targetElement.appendChild(createFolderItemElement(folder));
            });
            files.forEach(file => {
                targetElement.appendChild(createFileItemElement(file));
            });
        } else {
             files.forEach(file => {
                targetElement.appendChild(createFileItemElement(file));
            });
        }
    }

    function createEmptyStateHtml(searchTerm) {
        const activeNavId = document.querySelector('.bottom-nav .nav-item.active').getAttribute('data-nav');
        
        let message = searchTerm ? 'Aradığınız dosya bulunamadı.' : 'Henüz hiç dosyanız yok.';
        
        if (currentFolder) {
            message = 'Bu klasör boş.';
        } else if (activeNavId === 'favorites') {
            message = 'Favorilerinize eklenmiş dosya yok.';
        } else if (activeNavId === 'recent') { 
            message = 'Henüz açılmış dosya yok.';
        }
        
        return `
            <div class="empty-state">
                <i class="fas fa-folder-open fa-3x"></i>
                <p>${message}</p>
                ${!searchTerm && !currentFolder && activeNavId === 'all-files' ? '<p class="hint">Sol menüden (☰) dosya aktarabilirsiniz.</p>' : ''}
            </div>
        `;
    }

    function createFileItemElement(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        const isSelected = selectedFiles.has(file.name);

        fileItem.innerHTML = `
            <div class="file-item-wrapper">
                <input type="checkbox" class="file-checkbox" ${isSelected ? 'checked' : ''} data-filename="${file.name}">
                <div class="file-icon-container">
                    <i class="fas fa-file-pdf file-icon"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-details">${file.date} · ${file.size}</div>
                </div>
                <div class="file-actions">
                    <i class="favorite-icon ${file.isFavorite ? 'fas fa-star' : 'far fa-star'}" data-filename="${file.name}"></i>
                    <i class="fas fa-ellipsis-v file-menu" data-filename="${file.name}"></i>
                </div>
            </div>
        `;

        const checkbox = fileItem.querySelector('.file-checkbox');
        const fileItemWrapper = fileItem.querySelector('.file-item-wrapper');
        const favoriteIcon = fileItem.querySelector('.favorite-icon');
        const fileMenuIcon = fileItem.querySelector('.file-menu');

        // Event listeners
        fileItemWrapper.addEventListener('click', (e) => {
            if (selectionMode) {
                if (!e.target.classList.contains('file-checkbox') && e.target.closest('.file-actions') === null) {
                    checkbox.checked = !checkbox.checked;
                    updateSelectedFiles(checkbox.checked, file.name);
                }
            } else {
                viewPDF(file);
            }
        });

        checkbox.addEventListener('change', (e) => {
            updateSelectedFiles(e.target.checked, file.name);
        });

        favoriteIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(file.name);
        });

        fileMenuIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                showFileMenu(e.target, file.name);
        });

        return fileItem;
    }
    
    function createFolderItemElement(folder, isMoveItem = false) {
        const folderItem = document.createElement('div');
        folderItem.className = 'file-item folder-item';
        const isSelected = selectedFiles.has(folder.name);

        folderItem.innerHTML = `
            <div class="file-item-wrapper">
                <input type="checkbox" class="file-checkbox" ${isSelected ? 'checked' : ''} data-filename="${folder.name}">
                <div class="file-icon-container">
                    <i class="fas fa-folder file-icon"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${folder.name}</div>
                    <div class="file-details">${folder.date}</div>
                </div>
                ${!isMoveItem ? `
                    <div class="file-actions">
                        <i class="fas fa-ellipsis-v file-menu" data-filename="${folder.name}" data-is-folder="true"></i>
                    </div>
                ` : ''}
            </div>
        `;

        const checkbox = folderItem.querySelector('.file-checkbox');
        const folderItemWrapper = folderItem.querySelector('.file-item-wrapper');
        const fileMenuIcon = folderItem.querySelector('.file-menu');
        const folderIcon = folderItem.querySelector('.file-icon');
        if (folder.color) {
            folderIcon.style.color = folder.color;
        }

        folderItemWrapper.addEventListener('click', (e) => {
            if (selectionMode) {
                if (!e.target.classList.contains('file-checkbox') && e.target.closest('.file-actions') === null) {
                    checkbox.checked = !checkbox.checked;
                    updateSelectedFiles(checkbox.checked, folder.name);
                }
            } else {
                console.log(`Opening folder: ${folder.name}`);
                currentFolder = folder.name;
                headerTitle.textContent = folder.name;
                drawerToggle.style.display = 'none';
                backButton.style.display = 'block';
                renderCurrentContent();
            }
        });

        if (!isMoveItem) {
            checkbox.addEventListener('change', (e) => {
                updateSelectedFiles(e.target.checked, folder.name);
            });

            fileMenuIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                showFileMenu(e.target, folder.name, true);
            });
        }
        return folderItem;
    }

    function updateSelectedFiles(isChecked, fileName) {
        if (isChecked) {
            selectedFiles.add(fileName);
        } else {
            selectedFiles.delete(fileName);
        }
        updateSelectionCount();
    }

    function toggleFavorite(fileName) {
        const file = allFiles.find(f => f.name === fileName);
        if (file) {
            file.isFavorite = !file.isFavorite;
            saveFiles();
            renderCurrentContent();
        }
    }

    function deleteFiles(fileNames) {
        if (fileNames.length === 0) return;
        const confirmMsg = fileNames.length > 1 ?
            `${fileNames.length} dosyayı silmek istediğinizden emin misiniz?` :
            `${fileNames[0]} dosyasını silmek istediğinizden emin misiniz?`;

        if (window.confirm(confirmMsg)) {
            allFiles = allFiles.filter(f => {
                if (fileNames.includes(f.name)) {
                    return false;
                }
                return !f.parentFolder || !fileNames.includes(f.parentFolder);
            });
            
            saveFiles();
            toggleSelectionMode(false);
        }
    }

    function moveFiles(fileNames, newFolderName) {
        if (fileNames.length === 0) return;
        fileNames.forEach(fileName => {
            const file = allFiles.find(f => f.name === fileName);
            if (file) {
                if (!file.isFolder) {
                    file.parentFolder = newFolderName;
                } else if (file.isFolder) {
                    file.parentFolder = newFolderName; 
                }
            }
        });
        saveFiles();
        toggleSelectionMode(false);
        renderCurrentContent();
    }

    function showFileMenu(targetIcon, fileName, isFolder = false) {
        const rect = targetIcon.getBoundingClientRect();
        fileMenuPopup.style.top = `${rect.bottom + 5}px`;
        fileMenuPopup.style.left = `${rect.left - 150}px`;
        fileMenuPopup.style.display = 'block';
        fileMenuPopup.setAttribute('data-target-file', fileName);

        const favoriteMenuItem = fileMenuPopup.querySelector('.menu-favorite');
        const moveMenuItem = fileMenuPopup.querySelector('.menu-move');
        const changeColorMenuItem = fileMenuPopup.querySelector('.menu-change-color');
        const shareMenuItem = fileMenuPopup.querySelector('.menu-share');
        
        if (isFolder) {
            favoriteMenuItem.style.display = 'none';
            moveMenuItem.style.display = 'flex';
            changeColorMenuItem.style.display = 'flex';
            shareMenuItem.style.display = 'flex';
        } else {
            favoriteMenuItem.style.display = 'flex';
            moveMenuItem.style.display = 'flex';
            changeColorMenuItem.style.display = 'none';
            shareMenuItem.style.display = 'flex';
            const file = allFiles.find(f => f.name === fileName);
            if (file) {
                const favoriteSpan = favoriteMenuItem.querySelector('span');
                const favoriteIcon = favoriteMenuItem.querySelector('i');
                favoriteSpan.textContent = file.isFavorite ? 'Favorilerden Kaldır' : 'Favorilere Ekle';
                favoriteIcon.className = file.isFavorite ? 'fas fa-star' : 'far fa-star';
            }
        }
    }

    function showMovePopup() {
        moveListContent.innerHTML = '';
        const foldersToMoveTo = allFiles.filter(item => item.isFolder && item.name !== currentFolder);
        
        const movingItemNames = Array.from(selectedFiles);
        
        const filteredFolders = foldersToMoveTo.filter(folder => {
            if (movingItemNames.includes(folder.name)) return false; 
            
            return !movingItemNames.some(itemName => {
                const item = allFiles.find(f => f.name === itemName);
                return item.isFolder && isChildFolder(folder.name, itemName);
            });
        });

        if (currentFolder !== null) {
            const rootFolderItem = document.createElement('div');
            rootFolderItem.className = 'file-item folder-item';
            rootFolderItem.innerHTML = `
                <div class="file-item-wrapper">
                    <div class="file-icon-container">
                        <i class="fas fa-folder file-icon" style="color:#f44336"></i>
                    </div>
                    <div class="file-info">
                        <div class="file-name">Ana Klasör</div>
                        <div class="file-details">Tüm dosyaların ana klasörü</div>
                    </div>
                </div>
            `;
            rootFolderItem.addEventListener('click', () => {
                moveFiles(movingItemNames, null);
                movePopup.style.display = 'none';
            });
            moveListContent.appendChild(rootFolderItem);
        }

        if (filteredFolders.length > 0) {
            filteredFolders.forEach(folder => {
                const folderElement = createFolderItemElement(folder, true);
                folderElement.addEventListener('click', () => {
                    moveFiles(movingItemNames, folder.name);
                    movePopup.style.display = 'none';
                });
                moveListContent.appendChild(folderElement);
            });
        }
        
        if (currentFolder === null && filteredFolders.length === 0) {
            moveListContent.innerHTML = '<div class="empty-state"><p>Başka taşınabilir klasör bulunmuyor.</p></div>';
        }

        movePopup.style.display = 'flex';
    }

    function isChildFolder(childName, parentName) {
        let current = allFiles.find(f => f.name === childName);
        while (current) {
            if (current.parentFolder === parentName) return true;
            current = allFiles.find(f => f.name === current.parentFolder);
        }
        return false;
    }

    function getSortFunction(criteria) {
        return (a, b) => {
            if (a.isFolder && !b.isFolder) return -1;
            if (!a.isFolder && b.isFolder) return 1;

            switch (criteria) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'name-asc':
                    return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
                case 'name-desc':
                    return b.name.localeCompare(a.name, 'tr', { sensitivity: 'base' });
                case 'size-asc':
                    return parseFloat(a.size.replace(' kB', '')) - parseFloat(b.size.replace(' kB', ''));
                case 'size-desc':
                    return parseFloat(b.size.replace(' kB', '')) - parseFloat(a.size.replace(' kB', ''));
                default:
                    return 0;
            }
        };
    }
    
    function createFolder() {
        const folderName = window.prompt("Yeni klasör adı girin:", "Adsız Klasör");
        if (folderName && folderName.trim() !== '') {
            if (allFiles.some(f => f.isFolder && f.name === folderName && f.parentFolder === currentFolder)) {
                alert("Bu klasörde aynı isimde bir klasör zaten mevcut.");
                return;
            }
            const newFolder = {
                name: folderName,
                isFolder: true,
                date: new Date().toLocaleDateString('tr-TR'),
                parentFolder: currentFolder,
                color: '#ffc107'
            };
            allFiles.push(newFolder);
            saveFiles();
            renderCurrentContent();
            console.log(`New folder created: ${folderName}`);
        }
    }

    // --- PDF Görüntüleme Fonksiyonu ---
    function viewPDF(file) {
        if (file.type === 'pdf' && file.data) {
            file.lastOpened = new Date().toISOString(); 
            saveFiles();
            
            sessionStorage.setItem('pdfData', file.data);
            window.open('web/viewer.html', '_blank');

            if (document.querySelector('.bottom-nav .nav-item.active').getAttribute('data-nav') === 'recent') {
                renderCurrentContent();
            }

        } else {
            alert('Bu dosya için Base64 verisi bulunamadı. Lütfen dosyanın Base64 olarak doğru yüklendiğinden emin olun.');
            console.error('PDF verisi (Base64) bulunamadı veya geçerli bir PDF dosyası değil:', file.name);
        }
    }

    function base64toBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: mimeType });
    }

    // --- GELİŞMİŞ DOSYA PAYLAŞIM FONKSİYONU ---
    async function shareFiles(filesToShare) {
        try {
            if (!navigator.share) {
                return fallbackShare(filesToShare);
            }

            const fileObjects = [];
            
            for (const fileName of filesToShare) {
                const file = allFiles.find(f => f.name === fileName);
                if (!file) continue;

                if (file.isFolder) {
                    const folderFiles = allFiles.filter(f => f.parentFolder === fileName && !f.isFolder);
                    for (const childFile of folderFiles) {
                        if (childFile.data) {
                            const blob = base64toBlob(childFile.data, 'application/pdf');
                            fileObjects.push(new File([blob], childFile.name, { type: 'application/pdf' }));
                        }
                    }
                } else {
                    if (file.data) {
                        const blob = base64toBlob(file.data, 'application/pdf');
                        fileObjects.push(new File([blob], file.name, { type: 'application/pdf' }));
                    }
                }
            }

            if (fileObjects.length === 0) {
                alert('Paylaşılacak dosya bulunamadı. Yalnızca Base64 verisi olan PDF dosyaları paylaşılabilir.');
                return;
            }

            if (navigator.canShare && navigator.canShare({ files: fileObjects })) {
                await navigator.share({
                    files: fileObjects,
                    title: 'PDF Dosyaları',
                    text: `PDF Reader uygulamasından ${fileObjects.length} dosya paylaşıyorum.`
                });
                
                console.log('Paylaşım başarılı.');
                alert(`${fileObjects.length} dosya başarıyla paylaşıldı!`);
            } else {
                fallbackShare(filesToShare);
            }

        } catch (error) {
            console.error('Paylaşım hatası:', error);
            
            if (error.name !== 'AbortError') {
                alert('Paylaşım sırasında bir hata oluştu: ' + error.message);
            }
        }
    }

    function fallbackShare(filesToShare) {
        const fileNames = filesToShare.map(fileName => {
            const file = allFiles.find(f => f.name === fileName);
            return file ? file.name : fileName;
        }).join(', ');

        const shareText = `Paylaşmak istediğim dosyalar: ${fileNames}\n\nBu dosyaları PDF Reader uygulamasından paylaşıyorum.`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert(`Dosya isimleri panoya kopyalandı! Paylaşmak için yapıştırın.\n\n${shareText}`);
            }).catch(() => {
                alert(shareText);
            });
        } else {
            alert(shareText);
        }
    }

    // --- PDF ARAÇLARI FONKSİYONLARI ---

    // PDF Sıkıştırma
    async function compressPDF(pdfFile, level = 'medium') {
        try {
            const existingPdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
            
            const compressOptions = {
                useObjectStreams: true,
                compress: true,
                objectsPerTick: 50
            };

            const compressedPdfBytes = await pdfDoc.save(compressOptions);
            
            return compressedPdfBytes;
        } catch (error) {
            console.error('Sıkıştırma hatası:', error);
            throw new Error('PDF sıkıştırma başarısız: ' + error.message);
        }
    }

    // PDF Birleştirme
    async function mergePDFs(pdfFiles) {
        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            
            for (const file of pdfFiles) {
                const pdfBytes = await file.arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(pdfBytes);
                const pageIndices = pdf.getPageIndices();
                const pages = await mergedPdf.copyPages(pdf, pageIndices);
                pages.forEach(page => mergedPdf.addPage(page));
            }
            
            const mergedPdfBytes = await mergedPdf.save();
            return mergedPdfBytes;
        } catch (error) {
            console.error('Birleştirme hatası:', error);
            throw new Error('PDF birleştirme başarısız: ' + error.message);
        }
    }

    // PDF Ayırma
    async function splitPDF(pdfFile, startPage, endPage) {
        try {
            const existingPdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
            const totalPages = pdfDoc.getPageCount();
            
            if (startPage < 1 || endPage > totalPages || startPage > endPage) {
                throw new Error(`Geçersiz sayfa aralığı. Dosyada ${totalPages} sayfa bulunuyor.`);
            }
            
            const newPdf = await PDFLib.PDFDocument.create();
            const pageIndices = [];
            
            for (let i = startPage - 1; i < endPage; i++) {
                pageIndices.push(i);
            }
            
            const pages = await newPdf.copyPages(pdfDoc, pageIndices);
            pages.forEach(page => newPdf.addPage(page));
            
            const splitPdfBytes = await newPdf.save();
            return splitPdfBytes;
        } catch (error) {
            console.error('Ayırma hatası:', error);
            throw new Error('PDF ayırma başarısız: ' + error.message);
        }
    }

    // PDF Kilitleme - GÜNCEL ve ÇALIŞAN
    async function lockPDF(pdfFile, password, options = {}) {
        try {
            const existingPdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
            
            // PDF'ı şifrele - GÜNCEL YÖNTEM
            const encryptedPdfBytes = await pdfDoc.save({
                useObjectStreams: true,
                userPassword: password,
                ownerPassword: password + '_owner',
                permissions: {
                    printing: options.allowPrinting ? 'lowResolution' : 'notAllowed',
                    copying: options.allowCopying,
                    modifying: false,
                    annotating: true,
                    fillingForms: true,
                    contentAccessibility: true,
                    documentAssembly: true
                }
            });
            
            return encryptedPdfBytes;
        } catch (error) {
            console.error('Kilitleme hatası:', error);
            throw new Error('PDF kilitleme başarısız: ' + error.message);
        }
    }

    // PDF Kilidini Açma - GÜNCEL ve ÇALIŞAN
    async function unlockPDF(pdfFile, password) {
        try {
            const existingPdfBytes = await pdfFile.arrayBuffer();
            
            // Şifreli PDF'i yükle
            const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes, {
                password: password,
                ignoreEncryption: false
            });
            
            // Şifreyi kaldır
            const decryptedPdfBytes = await pdfDoc.save();
            return decryptedPdfBytes;
        } catch (error) {
            console.error('Kilidi açma hatası:', error);
            if (error.message.includes('Incorrect password') || error.message.includes('Password required')) {
                throw new Error('Yanlış şifre! Lütfen doğru şifreyi girin.');
            }
            throw new Error('PDF kilidi açma başarısız: ' + error.message);
        }
    }

    // Test fonksiyonu - PDF'in şifreli olup olmadığını kontrol et
    async function isPDFEncrypted(pdfFile) {
        try {
            const existingPdfBytes = await pdfFile.arrayBuffer();
            // Şifresiz yüklemeyi dene
            await PDFLib.PDFDocument.load(existingPdfBytes);
            return false;
        } catch (error) {
            // Hata alırsa şifreli demektir
            return true;
        }
    }

    // Dijital İmza Ekleme (Basitleştirilmiş)
    async function addDigitalSignature(pdfFile, certificateFile, password, reason = '', location = '') {
        try {
            const existingPdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
            
            // Bu kısım gerçek dijital imza için daha karmaşık kriptografik işlemler gerektirir
            // Şu anlık basit bir metin imzası olarak uyguluyoruz
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            
            // İmza bilgisini sayfaya ekle
            const signatureText = `Dijital İmza\nTarih: ${new Date().toLocaleDateString('tr-TR')}\nSebep: ${reason || 'İmzalı belge'}\nKonum: ${location || 'Bilinmiyor'}`;
            
            firstPage.drawText(signatureText, {
                x: 50,
                y: 100,
                size: 10,
                color: PDFLib.rgb(0, 0, 0),
            });
            
            const signedPdfBytes = await pdfDoc.save();
            return signedPdfBytes;
        } catch (error) {
            console.error('Dijital imza hatası:', error);
            throw new Error('Dijital imza ekleme başarısız: ' + error.message);
        }
    }

    // İşlenmiş PDF'i kaydetme
    async function saveProcessedPDF(bytes, fileName) {
        const blob = new Blob([bytes], { type: 'application/pdf' });
        
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Data = e.target.result.split(',')[1];
                
                const processedFile = {
                    name: fileName,
                    type: 'pdf',
                    date: new Date().toLocaleDateString('tr-TR'),
                    size: `${(blob.size / 1024).toFixed(2)} kB`,
                    isFavorite: false,
                    isFolder: false,
                    parentFolder: currentFolder,
                    data: base64Data,
                    lastOpened: null
                };
                
                resolve(processedFile);
            };
            reader.readAsDataURL(blob);
        });
    }

    // --- ARAÇLAR POPUP YÖNETİMİ ---
    function initializeTools() {
        const toolItems = document.querySelectorAll('.tool-item[data-tool]');
        
        toolItems.forEach(item => {
            item.addEventListener('click', () => {
                const tool = item.getAttribute('data-tool');
                handleToolSelection(tool);
            });
        });
        
        setupToolPopups();
    }

    function handleToolSelection(tool) {
        switch (tool) {
            case 'compress':
                showCompressPopup();
                break;
            case 'merge':
                showMergePopup();
                break;
            case 'split':
                showSplitPopup();
                break;
            case 'lock':
                showLockPopup();
                break;
            case 'unlock':
                showUnlockPopup();
                break;
            case 'sign':
                showSignPopup();
                break;
        }
    }

    function setupToolPopups() {
        // Sıkıştırma popup
        document.getElementById('compress-cancel').addEventListener('click', () => {
            document.getElementById('compress-popup').style.display = 'none';
        });
        
        document.getElementById('compress-confirm').addEventListener('click', async () => {
            const fileInput = document.getElementById('compress-file-input');
            const level = document.getElementById('compress-level').value;
            
            if (!fileInput.files[0]) {
                alert('Lütfen bir PDF dosyası seçin.');
                return;
            }
            
            try {
                showLoading('Sıkıştırılıyor...');
                const compressedBytes = await compressPDF(fileInput.files[0], level);
                const processedFile = await saveProcessedPDF(compressedBytes, `sıkıştırılmış_${fileInput.files[0].name}`);
                
                allFiles.push(processedFile);
                saveFiles();
                renderCurrentContent();
                document.getElementById('compress-popup').style.display = 'none';
                hideLoading();
                alert('PDF başarıyla sıkıştırıldı!');
            } catch (error) {
                hideLoading();
                alert('Sıkıştırma hatası: ' + error.message);
            }
        });
        
        // Birleştirme popup
        document.getElementById('merge-cancel').addEventListener('click', () => {
            document.getElementById('merge-popup').style.display = 'none';
        });
        
        document.getElementById('merge-file-input').addEventListener('change', function() {
            const fileList = document.getElementById('merge-file-list');
            fileList.innerHTML = '';
            
            if (this.files.length > 0) {
                Array.from(this.files).forEach((file, index) => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.innerHTML = `
                        <div class="file-item-wrapper">
                            <div class="file-icon-container">
                                <i class="fas fa-file-pdf file-icon"></i>
                            </div>
                            <div class="file-info">
                                <div class="file-name">${file.name}</div>
                                <div class="file-details">${(file.size / 1024).toFixed(2)} kB</div>
                            </div>
                        </div>
                    `;
                    fileList.appendChild(fileItem);
                });
            }
        });
        
        document.getElementById('merge-confirm').addEventListener('click', async () => {
            const fileInput = document.getElementById('merge-file-input');
            
            if (!fileInput.files || fileInput.files.length < 2) {
                alert('Lütfen en az 2 PDF dosyası seçin.');
                return;
            }
            
            try {
                showLoading('Birleştiriliyor...');
                const mergedBytes = await mergePDFs(Array.from(fileInput.files));
                const processedFile = await saveProcessedPDF(mergedBytes, `birleştirilmiş_${new Date().getTime()}.pdf`);
                
                allFiles.push(processedFile);
                saveFiles();
                renderCurrentContent();
                document.getElementById('merge-popup').style.display = 'none';
                hideLoading();
                alert('PDF\'ler başarıyla birleştirildi!');
            } catch (error) {
                hideLoading();
                alert('Birleştirme hatası: ' + error.message);
            }
        });
        
        // Ayırma popup - GÜNCEL
        document.getElementById('split-cancel').addEventListener('click', () => {
            document.getElementById('split-popup').style.display = 'none';
        });

        // Ayırma seçeneklerini değiştirme
        document.querySelectorAll('input[name="split-option"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const singlePageGroup = document.getElementById('single-page-group');
                const pageRangeGroup = document.getElementById('page-range-group');
                
                if (this.value === 'single') {
                    singlePageGroup.style.display = 'block';
                    pageRangeGroup.style.display = 'none';
                } else if (this.value === 'range') {
                    singlePageGroup.style.display = 'none';
                    pageRangeGroup.style.display = 'block';
                } else {
                    singlePageGroup.style.display = 'none';
                    pageRangeGroup.style.display = 'none';
                }
            });
        });
        
        document.getElementById('split-file-input').addEventListener('change', async function() {
            if (this.files[0]) {
                try {
                    const existingPdfBytes = await this.files[0].arrayBuffer();
                    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
                    const totalPages = pdfDoc.getPageCount();
                    
                    // Sayfa input'larını güncelle
                    document.getElementById('split-single-page').max = totalPages;
                    document.getElementById('split-single-page').value = 1;
                    
                    document.getElementById('split-start-page').max = totalPages;
                    document.getElementById('split-start-page').value = 1;
                    
                    document.getElementById('split-end-page').max = totalPages;
                    document.getElementById('split-end-page').value = totalPages;
                    
                    // Toplam sayfa bilgisini göster
                    document.getElementById('total-pages-count').textContent = totalPages;
                    document.getElementById('total-pages-info').style.display = 'block';
                    
                } catch (error) {
                    console.error('Sayfa sayısı alınamadı:', error);
                    document.getElementById('total-pages-info').style.display = 'none';
                }
            }
        });
        
        document.getElementById('split-confirm').addEventListener('click', async () => {
            const fileInput = document.getElementById('split-file-input');
            const splitOption = document.querySelector('input[name="split-option"]:checked').value;
            
            if (!fileInput.files[0]) {
                alert('Lütfen bir PDF dosyası seçin.');
                return;
            }
            
            try {
                showLoading('Ayrılıyor...');
                const originalName = fileInput.files[0].name.replace('.pdf', '');
                let processedFiles = [];
                
                if (splitOption === 'single') {
                    const pageNum = parseInt(document.getElementById('split-single-page').value);
                    const splitBytes = await splitPDF(fileInput.files[0], pageNum, pageNum);
                    const processedFile = await saveProcessedPDF(splitBytes, `${originalName}_sayfa${pageNum}.pdf`);
                    processedFiles.push(processedFile);
                    
                } else if (splitOption === 'range') {
                    const startPage = parseInt(document.getElementById('split-start-page').value);
                    const endPage = parseInt(document.getElementById('split-end-page').value);
                    const splitBytes = await splitPDF(fileInput.files[0], startPage, endPage);
                    const processedFile = await saveProcessedPDF(splitBytes, `${originalName}_sayfa${startPage}-${endPage}.pdf`);
                    processedFiles.push(processedFile);
                    
                } else if (splitOption === 'all') {
                    const existingPdfBytes = await fileInput.files[0].arrayBuffer();
                    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
                    const totalPages = pdfDoc.getPageCount();
                    
                    // Tüm sayfaları ayrı ayrı ayır
                    for (let i = 1; i <= totalPages; i++) {
                        const splitBytes = await splitPDF(fileInput.files[0], i, i);
                        const processedFile = await saveProcessedPDF(splitBytes, `${originalName}_sayfa${i}.pdf`);
                        processedFiles.push(processedFile);
                    }
                }
                
                // Tüm dosyaları ekle
                processedFiles.forEach(file => {
                    allFiles.push(file);
                });
                
                saveFiles();
                renderCurrentContent();
                document.getElementById('split-popup').style.display = 'none';
                hideLoading();
                
                if (splitOption === 'all') {
                    alert(`${processedFiles.length} sayfa başarıyla ayrıldı!`);
                } else {
                    alert('PDF başarıyla ayrıldı!');
                }
                
            } catch (error) {
                hideLoading();
                alert('Ayırma hatası: ' + error.message);
            }
        });
        
        // Kilitleme popup
        document.getElementById('lock-cancel').addEventListener('click', () => {
            document.getElementById('lock-popup').style.display = 'none';
        });
        
        document.getElementById('lock-confirm').addEventListener('click', async () => {
            const fileInput = document.getElementById('lock-file-input');
            const password = document.getElementById('lock-password').value;
            const confirmPassword = document.getElementById('lock-confirm-password').value;
            const allowPrinting = document.getElementById('allow-printing').checked;
            const allowCopying = document.getElementById('allow-copying').checked;
            
            if (!fileInput.files[0]) {
                alert('Lütfen bir PDF dosyası seçin.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Şifreler eşleşmiyor!');
                return;
            }
            
            if (password.length < 4) {
                alert('Şifre en az 4 karakter olmalıdır.');
                return;
            }
            
            try {
                showLoading('Kilitleniyor...');
                const lockedBytes = await lockPDF(fileInput.files[0], password, {
                    allowPrinting,
                    allowCopying
                });
                const processedFile = await saveProcessedPDF(lockedBytes, `kilitli_${fileInput.files[0].name}`);
                
                allFiles.push(processedFile);
                saveFiles();
                renderCurrentContent();
                document.getElementById('lock-popup').style.display = 'none';
                hideLoading();
                alert('PDF başarıyla kilitlendi!');
            } catch (error) {
                hideLoading();
                alert('Kilitleme hatası: ' + error.message);
            }
        });
        
        // Kilidi açma popup - GÜNCEL
        document.getElementById('unlock-cancel').addEventListener('click', () => {
            document.getElementById('unlock-popup').style.display = 'none';
        });
        
        document.getElementById('unlock-confirm').addEventListener('click', async () => {
            const fileInput = document.getElementById('unlock-file-input');
            const password = document.getElementById('unlock-password').value;
            
            if (!fileInput.files[0]) {
                alert('Lütfen bir PDF dosyası seçin.');
                return;
            }
            
            if (!password) {
                alert('Lütfen şifreyi girin.');
                return;
            }
            
            try {
                showLoading('Kilidi açılıyor...');
                
                // Önce PDF'in şifreli olup olmadığını kontrol et
                const isEncrypted = await isPDFEncrypted(fileInput.files[0]);
                if (!isEncrypted) {
                    hideLoading();
                    alert('Bu PDF zaten şifresiz!');
                    return;
                }
                
                const unlockedBytes = await unlockPDF(fileInput.files[0], password);
                const processedFile = await saveProcessedPDF(unlockedBytes, `kilidi_açılmış_${fileInput.files[0].name}`);
                
                allFiles.push(processedFile);
                saveFiles();
                renderCurrentContent();
                document.getElementById('unlock-popup').style.display = 'none';
                hideLoading();
                alert('PDF kilidi başarıyla açıldı!');
            } catch (error) {
                hideLoading();
                alert('Kilidi açma hatası: ' + error.message);
            }
        });
        
        // Dijital imza popup
        document.getElementById('sign-cancel').addEventListener('click', () => {
            document.getElementById('sign-popup').style.display = 'none';
        });
        
        document.getElementById('sign-confirm').addEventListener('click', async () => {
            const fileInput = document.getElementById('sign-file-input');
            const certificateFile = document.getElementById('certificate-file').files[0];
            const password = document.getElementById('certificate-password').value;
            const reason = document.getElementById('signature-reason').value;
            const location = document.getElementById('signature-location').value;
            
            if (!fileInput.files[0]) {
                alert('Lütfen bir PDF dosyası seçin.');
                return;
            }
            
            if (!certificateFile) {
                alert('Lütfen bir sertifika dosyası seçin.');
                return;
            }
            
            if (!password) {
                alert('Lütfen sertifika şifresini girin.');
                return;
            }
            
            try {
                showLoading('İmzalanıyor...');
                const signedBytes = await addDigitalSignature(fileInput.files[0], certificateFile, password, reason, location);
                const processedFile = await saveProcessedPDF(signedBytes, `imzalı_${fileInput.files[0].name}`);
                
                allFiles.push(processedFile);
                saveFiles();
                renderCurrentContent();
                document.getElementById('sign-popup').style.display = 'none';
                hideLoading();
                alert('PDF başarıyla imzalandı!');
            } catch (error) {
                hideLoading();
                alert('İmzalama hatası: ' + error.message);
            }
        });
        
        // Popup overlay'larına tıklayınca kapatma
        document.querySelectorAll('.popup-overlay').forEach(popup => {
            popup.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.style.display = 'none';
                }
            });
        });
    }

    function showLoading(message = 'İşleniyor...') {
        const loadingEl = document.getElementById('loading-spinner');
        if (loadingEl) {
            loadingEl.querySelector('p').textContent = message;
            loadingEl.classList.add('active');
        }
    }

    function hideLoading() {
        const loadingEl = document.getElementById('loading-spinner');
        if (loadingEl) {
            loadingEl.classList.remove('active');
        }
    }

    function showCompressPopup() {
        document.getElementById('compress-popup').style.display = 'flex';
        document.getElementById('compress-file-input').value = '';
    }

    function showMergePopup() {
        document.getElementById('merge-popup').style.display = 'flex';
        document.getElementById('merge-file-input').value = '';
        document.getElementById('merge-file-list').innerHTML = '';
    }

    function showSplitPopup() {
        document.getElementById('split-popup').style.display = 'flex';
        document.getElementById('split-file-input').value = '';
        document.getElementById('split-single-page').value = '1';
        document.getElementById('split-start-page').value = '1';
        document.getElementById('split-end-page').value = '1';
        document.getElementById('single-page-group').style.display = 'block';
        document.getElementById('page-range-group').style.display = 'none';
        document.getElementById('total-pages-info').style.display = 'none';
        document.querySelector('input[name="split-option"][value="single"]').checked = true;
    }

    function showLockPopup() {
        document.getElementById('lock-popup').style.display = 'flex';
        document.getElementById('lock-file-input').value = '';
        document.getElementById('lock-password').value = '';
        document.getElementById('lock-confirm-password').value = '';
        document.getElementById('allow-printing').checked = false;
        document.getElementById('allow-copying').checked = false;
    }

    function showUnlockPopup() {
        document.getElementById('unlock-popup').style.display = 'flex';
        document.getElementById('unlock-file-input').value = '';
        document.getElementById('unlock-password').value = '';
    }

    function showSignPopup() {
        document.getElementById('sign-popup').style.display = 'flex';
        document.getElementById('sign-file-input').value = '';
        document.getElementById('certificate-file').value = '';
        document.getElementById('certificate-password').value = '';
        document.getElementById('signature-reason').value = '';
        document.getElementById('signature-location').value = '';
    }

    // --- EVENT LISTENERS ---
    document.addEventListener('click', (e) => {
        if (!fileMenuPopup.contains(e.target) && !e.target.classList.contains('file-menu')) {
            fileMenuPopup.style.display = 'none';
        }
        if (!colorPickerPopup.contains(e.target) && !e.target.closest('.menu-change-color')) {
            colorPickerPopup.style.display = 'none';
        }
    });
    
    createFolderIcon.addEventListener('click', createFolder);

    fileMenuPopup.addEventListener('click', async (e) => {
        const action = e.target.closest('li')?.getAttribute('data-action');
        const fileName = fileMenuPopup.getAttribute('data-target-file');

        if (action === 'toggle-favorite') {
            toggleFavorite(fileName);
        } else if (action === 'rename') {
            const file = allFiles.find(f => f.name === fileName);
            if (file) {
                const newName = window.prompt("Dosyayı yeniden adlandır:", file.name);
                 if (newName && newName.trim() !== '' && newName !== file.name) {
                    if (allFiles.some(f => f.name === newName && f.parentFolder === file.parentFolder)) {
                        alert("Bu klasörde aynı isimde bir dosya/klasör zaten mevcut.");
                        return;
                    }
                    file.name = newName;
                    saveFiles();
                    renderCurrentContent();
                }
            }
        } else if (action === 'move') {
            selectedFiles.clear();
            selectedFiles.add(fileName);
            showMovePopup();
        } else if (action === 'delete') {
            deleteFiles([fileName]);
        } else if (action === 'share') {
            await shareFiles([fileName]);
            fileMenuPopup.style.display = 'none';
        } else if (action === 'change-color') {
            targetFolderForColor = fileName;
            colorPickerPopup.style.display = 'flex';
            fileMenuPopup.style.display = 'none';
            
            const folder = allFiles.find(f => f.name === targetFolderForColor);
            const currentColor = folder ? folder.color : '#ffc107';
            document.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.classList.remove('active');
                if (swatch.getAttribute('data-color') === currentColor) {
                    swatch.classList.add('active');
                }
            });
        }
        fileMenuPopup.style.display = 'none';
    });

    colorGrid.addEventListener('click', (e) => {
        const swatch = e.target.closest('.color-swatch');
        if (swatch && targetFolderForColor) {
            const newColor = swatch.getAttribute('data-color');
            const folder = allFiles.find(f => f.name === targetFolderForColor);
            if (folder) {
                folder.color = newColor;
                saveFiles();
                renderCurrentContent();
            }
            colorPickerPopup.style.display = 'none';
        }
    });

    colorCancelButton.addEventListener('click', () => {
        colorPickerPopup.style.display = 'none';
        targetFolderForColor = null;
    });

    moveCancelButton.addEventListener('click', () => {
        movePopup.style.display = 'none';
    });

    selectionMove.addEventListener('click', () => {
        showMovePopup();
    });

    selectionShare.addEventListener('click', async () => {
        const filesToShareArray = Array.from(selectedFiles);
        
        if (filesToShareArray.length === 0) {
            alert('Paylaşmak için dosya seçin.');
            return;
        }

        await shareFiles(filesToShareArray);
        toggleSelectionMode(false);
    });

    searchIcon.addEventListener('click', () => {
        headerTitle.style.display = 'none';
        headerIcons.style.display = 'none';
        drawerToggle.style.display = 'none';
        backButton.style.display = 'none';
        searchBar.style.display = 'flex';
        searchInput.focus();
    });

    searchBack.addEventListener('click', () => {
        headerTitle.style.display = 'block';
        headerIcons.style.display = 'flex';
        const activeNavId = document.querySelector('.bottom-nav .nav-item.active').getAttribute('data-nav');
        drawerToggle.style.display = currentFolder === null && activeNavId === 'all-files' ? 'block' : 'none'; 
        backButton.style.display = currentFolder !== null && activeNavId === 'all-files' ? 'block' : 'none';
        searchBar.style.display = 'none';
        searchInput.value = '';
        currentSearchTerm = '';
        renderCurrentContent();
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        currentSearchTerm = '';
        renderCurrentContent();
    });

    searchInput.addEventListener('input', () => {
        currentSearchTerm = searchInput.value;
        renderCurrentContent();
    });

    sortIcon.addEventListener('click', () => {
        sortPopup.style.display = 'flex';
    });

    sortOptions.forEach(option => {
        option.addEventListener('click', () => {
            sortOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            currentSortCriteria = option.getAttribute('data-sort');
            sortPopup.style.display = 'none';
            renderCurrentContent();
        });
    });

    bottomNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const navId = item.getAttribute('data-nav');
            bottomNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            currentFolder = null; 
            showContent(navId);
        });
    });

    drawerToggle.addEventListener('click', () => toggleDrawer(true));
    
    document.addEventListener('touchstart', (e) => {
        if (e.touches[0].clientX < 50 || drawer.classList.contains('active')) {
            startX = e.touches[0].clientX;
        } else {
            startX = 0;
        }
    });

    document.addEventListener('touchend', (e) => {
        if (startX === 0) {
            return;
        }
        
        endX = e.changedTouches[0].clientX;
        const swipeDistance = Math.abs(endX - startX);

        if (drawer.classList.contains('active')) {
            if (endX < startX && swipeDistance > minSwipeDistance) {
                toggleDrawer(false);
            }
        } else {
            if (endX > startX && swipeDistance > minSwipeDistance) {
                toggleDrawer(true);
            }
        }
        
        startX = 0;
        endX = 0;
    });
    
    overlay.addEventListener('click', () => {
        if (drawer.classList.contains('active')) {
            toggleDrawer(false);
        }
    });

    backButton.addEventListener('click', () => {
        if (currentFolder) {
            const current = allFiles.find(f => f.name === currentFolder && f.isFolder);
            currentFolder = current ? current.parentFolder : null;
        }
        
        if (currentFolder === null) {
            headerTitle.textContent = 'Tüm Dosyalar';
            drawerToggle.style.display = 'block';
            backButton.style.display = 'none';
        } else {
            headerTitle.textContent = currentFolder;
        }

        renderCurrentContent();
    });

    selectIcon.addEventListener('click', () => toggleSelectionMode(true));
    selectionCancel.addEventListener('click', () => toggleSelectionMode(false));
    selectionDelete.addEventListener('click', () => deleteFiles(Array.from(selectedFiles)));
    
    selectionAll.addEventListener('click', () => {
        const currentContentFiles = allFiles.filter(item => item.parentFolder === currentFolder);
        const allFileNames = currentContentFiles.map(f => f.name);
        const allSelected = selectedFiles.size === allFileNames.length;

        if (allSelected) {
            selectedFiles.clear();
        } else {
            selectedFiles = new Set(allFileNames);
        }
        renderCurrentContent();
        updateSelectionCount();
    });
    
    darkModeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        localStorage.setItem('darkMode', e.target.checked);
    });

    importFileItem.addEventListener('click', () => {
        importFileInput.click();
    });

    importFileInput.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileName = file.name;
                    if (allFiles.some(f => f.name === fileName && f.parentFolder === currentFolder)) {
                        alert(`Aynı isimde bir dosya veya klasör (${fileName}) zaten mevcut. Lütfen yeniden adlandırın.`);
                        return;
                    }
                    
                    const fileType = fileName.split('.').pop().toLowerCase();
                    const fileSize = (file.size / 1024).toFixed(2); 
                    
                    allFiles.push({
                        name: fileName,
                        type: fileType,
                        date: new Date().toLocaleDateString('tr-TR'),
                        size: `${fileSize} kB`,
                        isFavorite: false,
                        isFolder: false,
                        parentFolder: currentFolder,
                        data: e.target.result.split(',')[1],
                        lastOpened: null 
                    });
                    saveFiles();
                    renderCurrentContent();
                    toggleDrawer(false);
                };
                reader.readAsDataURL(file);
            });
            event.target.value = null; 
        }
    });

    // --- INITIALIZATION ---
    function initializeApp() {
        allFiles = loadFiles();

        allFiles.forEach(file => {
            if (!file.isFolder && file.lastOpened === undefined) {
                file.lastOpened = null; 
            }
        });
        saveFiles();

        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        document.body.classList.toggle('dark-mode', isDarkMode);
        darkModeToggle.checked = isDarkMode;

        document.querySelector('.nav-item[data-nav="all-files"]').classList.add('active');
        document.querySelector('.sort-option[data-sort="date-desc"]').classList.add('active');
        document.querySelector('#all-files-content').classList.add('active');
        
        initializeTools();
        renderCurrentContent();
    }

    initializeApp();
});