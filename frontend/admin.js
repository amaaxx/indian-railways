// --- 1. Security Gatekeeper ---
const token = localStorage.getItem('blw_admin_token');
if (!token) {
    window.location.href = 'login.html';
}

// --- 2. API Setup ---
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal ? 'http://127.0.0.1:8000' : 'https://blw-secure-api.onrender.com';

// --- 3. Logout Logic ---
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('blw_admin_token');
    window.location.href = 'login.html';
});

// --- 4. File Input Display ---
document.getElementById('excelInput').addEventListener('change', function(e) {
    document.getElementById('excelFileName').textContent = e.target.files[0] ? e.target.files[0].name : "No file selected";
});
document.getElementById('bannerInput').addEventListener('change', function(e) {
    document.getElementById('bannerFileName').textContent = e.target.files[0] ? e.target.files[0].name : "No file selected";
});

// --- 5. Sync Database Logic ---
document.getElementById('syncDbBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('excelInput');
    const statusBox = document.getElementById('excelStatus');
    const btn = document.getElementById('syncDbBtn');

    if (!fileInput.files[0]) {
        statusBox.textContent = "Please select a file first.";
        statusBox.className = "status-msg status-error";
        statusBox.style.display = 'block';
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined">hourglass_empty</span> Processing...`;
    statusBox.style.display = 'none';

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload-excel/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            statusBox.textContent = `Success! Synchronized ${data.total_records} employee records.`;
            statusBox.className = "status-msg status-success";
        } else {
            statusBox.textContent = `Error: ${data.detail}`;
            statusBox.className = "status-msg status-error";
        }
    } catch (err) {
        statusBox.textContent = "Server connection failed.";
        statusBox.className = "status-msg status-error";
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<span class="material-symbols-outlined">sync</span> Synchronize Database`;
        statusBox.style.display = 'block';
    }
});

// --- 6. Broadcast Banner Logic ---
document.getElementById('uploadBannerBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('bannerInput');
    const statusBox = document.getElementById('bannerStatus');
    const btn = document.getElementById('uploadBannerBtn');

    if (!fileInput.files[0]) {
        statusBox.textContent = "Please select an image first.";
        statusBox.className = "status-msg status-error";
        statusBox.style.display = 'block';
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined">hourglass_empty</span> Uploading...`;
    statusBox.style.display = 'none';

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload-banner/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (response.ok) {
            statusBox.textContent = `Success! Emergency banner is now live.`;
            statusBox.className = "status-msg status-success";
        } else {
            statusBox.textContent = `Error uploading banner.`;
            statusBox.className = "status-msg status-error";
        }
    } catch (err) {
        statusBox.textContent = "Server connection failed.";
        statusBox.className = "status-msg status-error";
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<span class="material-symbols-outlined">publish</span> Broadcast Override`;
        statusBox.style.display = 'block';
    }
});