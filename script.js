document.addEventListener('DOMContentLoaded', () => {
    
    // --- API Configuration (Smart Routing) ---
    // Automatically switches between your laptop and the live server
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_BASE_URL = isLocal ? 'http://127.0.0.1:8000' : 'https://blw-secure-api.onrender.com';

    // 1. Spam-Click Protector (Debounce)
    const links = document.querySelectorAll('a.nav-link, .scrollable-list a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.classList.contains('is-clicked')) {
                e.preventDefault(); 
                console.log("Spam click prevented!"); 
                return;
            }
            this.classList.add('is-clicked');
            setTimeout(() => this.classList.remove('is-clicked'), 1500);
        });
    });

    // 2. Live Search Filtering 
    const searchInput = document.getElementById('searchInput');
    const allCards = document.querySelectorAll('.card, .sidebar');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();

            allCards.forEach(card => {
                const listItems = card.querySelectorAll('li');
                let hasVisibleLinks = false; 

                listItems.forEach(li => {
                    const linkText = li.textContent.toLowerCase();
                    if (linkText.includes(searchTerm)) {
                        li.style.display = ''; 
                        hasVisibleLinks = true; 
                    } else {
                        li.style.display = 'none'; 
                    }
                });

                card.style.display = (hasVisibleLinks || searchTerm === '') ? '' : 'none';
            });
        });
    }

    // 3. IMAGE SLIDER 
    const slides = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    let currentSlide = 0;
    const slideInterval = 3000; 
    let autoSlideTimer;

    function changeSlide(nextIndex) {
        if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

        currentSlide = (nextIndex >= slides.length) ? 0 : (nextIndex < 0) ? slides.length - 1 : nextIndex;

        if (slides[currentSlide]) slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function startAutoSlide() {
        clearInterval(autoSlideTimer); 
        autoSlideTimer = setInterval(() => changeSlide(currentSlide + 1), slideInterval);
    }

    function userInteract(action) {
        changeSlide(action);
        startAutoSlide(); 
    }

    if (prevBtn && nextBtn && slides.length > 0) {
        nextBtn.addEventListener('click', () => userInteract(currentSlide + 1));
        prevBtn.addEventListener('click', () => userInteract(currentSlide - 1));
        dots.forEach((dot, index) => dot.addEventListener('click', () => userInteract(index)));
        startAutoSlide();
    }

    // --- Smart Emergency Pop-up ---
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

    // --- Dynamic Birthday Marquee ---
    async function loadBirthdays() {
        const marquee = document.querySelector('.marquee-container marquee');
        if (!marquee) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/birthdays/today/`);
            if (response.ok) {
                const data = await response.json();
                if (data.birthdays && data.birthdays.length > 0) {
                    const namesString = data.birthdays.join("  ⭐  ");
                    marquee.textContent = `🎉 Banaras Locomotive Works wishes a very Happy Birthday to:  ${namesString} 🎉`;
                    marquee.style.fontWeight = "700";
                    marquee.style.color = "#b45309"; 
                }
            }
        } catch (error) {
            console.log("Could not fetch birthdays. Displaying default marquee.");
        }
    }
    
    loadBirthdays();
});