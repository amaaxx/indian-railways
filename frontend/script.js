document.addEventListener('DOMContentLoaded', () => {
    
    // --- API Configuration (Dynamic Intranet IP) ---
    const API_BASE_URL = window.location.protocol + "//" + window.location.hostname + ":8000";

    // --- 1. NEW Dropdown Search Logic ---
    const searchInput = document.getElementById('searchInput');
    const dropdowns = document.querySelectorAll('.dropdown-content');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();

            dropdowns.forEach(dropdown => {
                let hasMatch = false;
                const links = dropdown.querySelectorAll('a');

                links.forEach(link => {
                    const text = link.textContent.toLowerCase();
                    if (term !== "" && text.includes(term)) {
                        link.style.backgroundColor = '#fef3c7'; 
                        link.style.color = '#b45309';
                        hasMatch = true;
                    } else {
                        link.style.backgroundColor = '';
                        link.style.color = '';
                    }
                });

                if (term === "") {
                    dropdown.style.display = '';
                } else if (hasMatch) {
                    dropdown.style.display = 'block';
                } else {
                    dropdown.style.display = 'none';
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
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (nextIndex >= slides.length) ? 0 : (nextIndex < 0) ? slides.length - 1 : nextIndex;

        if (slides[currentSlide]) slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function startAutoSlide() {
        clearInterval(autoSlideTimer); 
        autoSlideTimer = setInterval(() => changeSlide(currentSlide + 1), 3500);
    }

    if (prevBtn && nextBtn && slides.length > 0) {
        nextBtn.addEventListener('click', () => { changeSlide(currentSlide + 1); startAutoSlide(); });
        prevBtn.addEventListener('click', () => { changeSlide(currentSlide - 1); startAutoSlide(); });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { changeSlide(index); startAutoSlide(); });
        });
        
        startAutoSlide();
    }

    // --- 3. Smart Emergency Pop-up ---
    const emergencyModal = document.getElementById('emergencyModal');
    const closeModalBtn = document.getElementById('closeModal');
    const emergencyImage = document.getElementById('emergencyImage');

    if (closeModalBtn && emergencyModal) {
        closeModalBtn.addEventListener('click', () => {
            emergencyModal.classList.remove('show');
        });
    }

    if (emergencyModal && emergencyImage) {
        fetch(`${API_BASE_URL}/api/get-banner/?timestamp=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                let cleanUrl = data.url.trim();
                let slash = cleanUrl.startsWith('/') ? '' : '/';
                let finalImageUrl = `${API_BASE_URL}${slash}${cleanUrl}`;

                emergencyImage.onload = function() {
                    emergencyModal.classList.add('show'); 
                };
                
                emergencyImage.src = `${finalImageUrl}?t=${new Date().getTime()}`;
            }
        })
        .catch(err => console.error("Banner fetch failed:", err));
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
                    const namesString = data.birthdays.map(name => `<span class="highlight">${name}</span>`).join("  •  ");
                    marquee.innerHTML = `🎉 CURRENT UPDATES: Happy Birthday to ${namesString} 🎉`;
                    
                    // --- THE SPEED FIX ---
                    // 1. Get the total number of characters in the new text
                    const textLength = marquee.innerText.length;
                    
                    // 2. Give the animation 0.15 seconds per character to scroll
                    // (Increase 0.15 to make it slower, decrease to make it faster)
                    const dynamicDuration = textLength * 0.15; 
                    
                    // 3. Apply the dynamic time to the CSS animation
                    marquee.style.animationDuration = `${dynamicDuration}s`;
                }
            }
        } catch (error) {
            console.log("Could not fetch birthdays. Displaying default marquee.");
        }
    }
    
    loadBirthdays();
});