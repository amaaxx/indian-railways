document.addEventListener('DOMContentLoaded', () => {

    // --- API Configuration (Smart Routing) ---
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_BASE_URL = isLocal ? 'http://127.0.0.1:8000' : 'https://blw-secure-api.onrender.com';

    // --- File Name Display Logic ---
    const excelInput = document.getElementById('excelInput');
    const excelFileName = document.getElementById('excelFileName');
    const bannerInput = document.getElementById('bannerInput');
    const bannerFileName = document.getElementById('bannerFileName');

    if (excelInput && excelFileName) {
        excelInput.addEventListener('change', (e) => {
            excelFileName.textContent = e.target.files[0] ? e.target.files[0].name : 'No file selected';
        });
    }

    if (bannerInput && bannerFileName) {
        bannerInput.addEventListener('change', (e) => {
            bannerFileName.textContent = e.target.files[0] ? e.target.files[0].name : 'No file selected';
        });
    }

    // --- Connect Frontend to FastAPI Backend ---
    const uploadExcelBtn = document.getElementById('uploadExcelBtn');
    const statusDiv = document.getElementById('excelStatus');

    if (uploadExcelBtn && excelInput && statusDiv) {
        uploadExcelBtn.addEventListener('click', async () => {
            
            if (!excelInput.files[0]) {
                alert("Please select an Excel or CSV file first!");
                return;
            }

            const formData = new FormData();
            formData.append("file", excelInput.files[0]);

            uploadExcelBtn.textContent = "Syncing Database...";
            uploadExcelBtn.style.opacity = "0.7";
            uploadExcelBtn.disabled = true;
            statusDiv.style.display = "none";
            statusDiv.className = "status-message"; // Reset classes entirely

            try {
                const response = await fetch(`${API_BASE_URL}/api/upload-excel/`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    statusDiv.textContent = `Success: ${result.total_records} employee records synchronized!`;
                    statusDiv.classList.add("status-success");
                    statusDiv.style.cssText = "display: block;"; // Clears inline red errors
                    
                    excelInput.value = "";
                    excelFileName.textContent = 'No file selected';
                } else {
                    statusDiv.textContent = `Error: ${result.detail}`;
                    statusDiv.style.cssText = "background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; display: block;";
                }
            } catch (error) {
                statusDiv.textContent = "Network Error: Is the FastAPI server running?";
                statusDiv.style.cssText = "background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; display: block;";
            } finally {
                uploadExcelBtn.innerHTML = '<span class="material-symbols-outlined btn-icon">sync</span> Sync Database';
                uploadExcelBtn.style.opacity = "1";
                uploadExcelBtn.disabled = false;
            }
        });
    }

    // --- Connect Red Button to Banner Upload ---
    const uploadBannerBtn = document.getElementById('uploadBannerBtn');
    
    if (uploadBannerBtn && bannerInput) {
        uploadBannerBtn.addEventListener('click', async () => {
            if (!bannerInput.files[0]) {
                alert("Please select an image file first!");
                return;
            }

            const formData = new FormData();
            formData.append("file", bannerInput.files[0]);

            uploadBannerBtn.textContent = "Deploying Alert...";
            uploadBannerBtn.disabled = true;

            try {
                const response = await fetch(`${API_BASE_URL}/api/upload-banner/`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    alert("🚨 Emergency Banner Deployed Successfully!");
                    bannerInput.value = "";
                    bannerFileName.textContent = 'No file selected';
                } else {
                    alert("Error deploying banner. Check file type.");
                }
            } catch (error) {
                alert("Network Error: Is the FastAPI server running?");
            } finally {
                uploadBannerBtn.innerHTML = '<span class="material-symbols-outlined btn-icon">send</span> Deploy Alert';
                uploadBannerBtn.disabled = false;
            }
        });
    }
});