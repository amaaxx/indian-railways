document.addEventListener('DOMContentLoaded', () => {
    
    // --- API Configuration ---
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_BASE_URL = isLocal ? 'http://127.0.0.1:8000' : 'https://blw-secure-api.onrender.com';

    // --- 1. NEW Dropdown Search Logic ---
    const searchInput = document.getElementById('searchInput');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();

            dropdownLinks.forEach(link => {
                const text = link.textContent.toLowerCase();
                if (text.includes(term) && term !== "") {
                    // Highlight the match
                    link.style.backgroundColor = '#fef3c7'; 
                    link.style.color = '#b45309';
                    // Force the parent dropdown to stay open
                    link.parentElement.style.display = 'block';
                } else {
                    link.style.backgroundColor = '';
                    link.style.color = '';
                    // Close the dropdown if search is cleared
                    if (term === "") link.parentElement.style.display = ''; 
                }
            });
        });
    }

    // --- 2. BULLETPROOF SLIDER LOGIC ---
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    let currentSlide = 0;
    let autoSlideTimer;

    function changeSlide(nextIndex) {
        // Clear active states
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Calculate next index
        currentSlide = (nextIndex >= slides.length) ? 0 : (nextIndex < 0) ? slides.length - 1 : nextIndex;

        // Apply new active states
        if (slides[currentSlide]) slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function startAutoSlide() {
        clearInterval(autoSlideTimer); 
        autoSlideTimer = setInterval(() => changeSlide(currentSlide + 1), 3500);
    }

    // Initialize Slider
    if (prevBtn && nextBtn && slides.length > 0) {
        nextBtn.addEventListener('click', () => { changeSlide(currentSlide + 1); startAutoSlide(); });
        prevBtn.addEventListener('click', () => { changeSlide(currentSlide - 1); startAutoSlide(); });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { changeSlide(index); startAutoSlide(); });
        });
        
        startAutoSlide(); // Kick off the timer
    }

    // --- 3. Smart Emergency Pop-up ---
    const emergencyModal = document.getElementById('emergencyModal');
    const closeModalBtn = document.getElementById('closeModal');
    const emergencyImage = document.getElementById('emergencyImage');

    if (emergencyModal && closeModalBtn && emergencyImage) {
        fetch(`${API_BASE_URL}/api/get-banner/`)
            .then(res => res.json())
            .then(data => {
                if (data.has_custom) emergencyImage.src = data.url;
            })
            .catch(() => console.log("Using default emergency banner."))
            .finally(() => {
                setTimeout(() => emergencyModal.classList.add('show'), 1000);
            });

        closeModalBtn.addEventListener('click', () => emergencyModal.classList.remove('show'));
        emergencyModal.addEventListener('click', (e) => {
            if (e.target === emergencyModal) emergencyModal.classList.remove('show');
        });
    }

    // --- 4. Dynamic Birthday Marquee ---
    async function loadBirthdays() {
        const marquee = document.getElementById('birthdayMarquee');
        if (!marquee) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/birthdays/today/`);
            if (response.ok) {
                const data = await response.json();
                if (data.birthdays && data.birthdays.length > 0) {
                    marquee.innerHTML = `🎉 Happy Birthday to: ${data.birthdays.join("  ⭐  ")} 🎉`;
                }
            }
        } catch (error) {
            console.log("Could not fetch birthdays. Displaying default marquee.");
        }
    }
    
    loadBirthdays();
});