document.addEventListener('DOMContentLoaded', () => {

    // --- File Name Display Logic ---
    const excelInput = document.getElementById('excelInput');
    const excelFileName = document.getElementById('excelFileName');
    const bannerInput = document.getElementById('bannerInput');
    const bannerFileName = document.getElementById('bannerFileName');

    if (excelInput && excelFileName) {
        excelInput.addEventListener('change', function(e) {
            excelFileName.textContent = e.target.files[0] ? e.target.files[0].name : 'No file selected';
        });
    }

    if (bannerInput && bannerFileName) {
        bannerInput.addEventListener('change', function(e) {
            bannerFileName.textContent = e.target.files[0] ? e.target.files[0].name : 'No file selected';
        });
    }

    // --- Connect Frontend to FastAPI Backend ---
    const uploadExcelBtn = document.getElementById('uploadExcelBtn');
    const statusDiv = document.getElementById('excelStatus');

    if (uploadExcelBtn && excelInput && statusDiv) {
        uploadExcelBtn.addEventListener('click', async () => {
            
            // 1. Validate a file is actually selected
            if (!excelInput.files[0]) {
                alert("Please select an Excel or CSV file first!");
                return;
            }

            // 2. Package the file for transmission
            const formData = new FormData();
            formData.append("file", excelInput.files[0]);

            // 3. Update UI to show loading state
            uploadExcelBtn.textContent = "Syncing Database...";
            uploadExcelBtn.style.opacity = "0.7";
            uploadExcelBtn.disabled = true;
            statusDiv.style.display = "none";
            statusDiv.className = "status-message"; // Reset classes

            try {
                // 4. Send the file to your Python Server
                const response = await fetch('http://127.0.0.1:8000/api/upload-excel/', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                // 5. Handle the Server's Response
                if (response.ok) {
                    statusDiv.textContent = `Success: ${result.total_records} employee records synchronized!`;
                    statusDiv.classList.add("status-success");
                    statusDiv.style.display = "block";
                    
                    // Reset the form
                    excelInput.value = "";
                    excelFileName.textContent = 'No file selected';
                } else {
                    // Show exact error from Python (e.g., missing columns)
                    statusDiv.textContent = `Error: ${result.detail}`;
                    statusDiv.style.background = "#fee2e2";
                    statusDiv.style.color = "#b91c1c";
                    statusDiv.style.display = "block";
                }
            } catch (error) {
                statusDiv.textContent = "Network Error: Is the FastAPI server running?";
                statusDiv.style.background = "#fee2e2";
                statusDiv.style.color = "#b91c1c";
                statusDiv.style.display = "block";
            } finally {
                // Restore button state
                uploadExcelBtn.textContent = "Sync Database";
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
                const response = await fetch('http://127.0.0.1:8000/api/upload-banner/', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    // Using a simple browser alert for the hackathon speed
                    alert("🚨 Emergency Banner Deployed Successfully!");
                    bannerInput.value = "";
                    document.getElementById('bannerFileName').textContent = 'No file selected';
                } else {
                    alert("Error deploying banner. Check file type.");
                }
            } catch (error) {
                alert("Network Error: Is the FastAPI server running?");
            } finally {
                uploadBannerBtn.textContent = "Deploy Alert";
                uploadBannerBtn.disabled = false;
            }
        });
    }
});