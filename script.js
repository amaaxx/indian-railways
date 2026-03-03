

   document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Spam-Click Protector (Debounce)
    // Selects all the links inside the cards and sidebars
    const links = document.querySelectorAll('a.nav-link, .scrollable-list a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            
            // If the link was already clicked in the last 1.5 seconds, block it
            if (this.classList.contains('is-clicked')) {
                e.preventDefault(); 
                console.log("Spam click prevented!"); 
                return;
            }
            
            // Otherwise, temporarily mark it as 'clicked'
            this.classList.add('is-clicked');
            
            // Unfreeze it after 1.5 seconds 
            setTimeout(() => {
                this.classList.remove('is-clicked');
            }, 1500);
        });
    });

   // 2. Live Search Filtering 
   const searchInput = document.getElementById('searchInput');
   // grab all the cards and sidebars so we can hide them entirely if they are empty
   const allCards = document.querySelectorAll('.card, .sidebar');

   if (searchInput) {
       // 'input' is better than 'keyup' because it detects pasting and deleting instantly
       searchInput.addEventListener('input', function(e) {
           const searchTerm = e.target.value.toLowerCase();

           allCards.forEach(card => {
               const listItems = card.querySelectorAll('li');
               let hasVisibleLinks = false; // Tracks if this card has any matches

               listItems.forEach(li => {
                   const linkText = li.textContent.toLowerCase();
                   
                   if (linkText.includes(searchTerm)) {
                       li.style.display = ''; // Show link
                       hasVisibleLinks = true; // We found a match!
                   } else {
                       li.style.display = 'none'; // Hide link
                   }
               });

               // If no links matched inside this specific card, hide the whole card!
               // (Unless the search bar is empty, then show everything)
               if (hasVisibleLinks || searchTerm === '') {
                   card.style.display = '';
               } else {
                   card.style.display = 'none';
               }
           });
       });
   } else {
       console.error("Search input not found! Check your HTML id.");
   }

   // 3. IMAGE SLIDER 
   const slides = document.querySelectorAll('.slider-image');
   const dots = document.querySelectorAll('.dot');
   const prevBtn = document.getElementById('prevSlide');
   const nextBtn = document.getElementById('nextSlide');
   
   let currentSlide = 0;
   const slideInterval = 3000; // 3 seconds 
   let autoSlideTimer;

   
   function changeSlide(nextIndex) {
    // 1. Remove .active 
    if (slides[currentSlide]) {
        slides[currentSlide].classList.remove('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }

    // 2. Update current index (handle wrapping around)
    if (nextIndex >= slides.length) {
        currentSlide = 0; // Wrap back to first
    } else if (nextIndex < 0) {
        currentSlide = slides.length - 1; // Wrap around to last
    } else {
        currentSlide = nextIndex; // Standard move
    }

    // 3. Add .active 
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

   //  TIMER LOGIC
   function startAutoSlide() {
       // Clear any existing timer so they don't double up
       clearInterval(autoSlideTimer); 
       autoSlideTimer = setInterval(() => {
           changeSlide(currentSlide + 1);
       }, slideInterval);
   }

   // INTERACTION LOGIC 
   function userInteract(action) {
       
       changeSlide(action);
       
       startAutoSlide(); 
   }

   // --- Event Listeners for Buttons ---
   if (prevBtn && nextBtn && slides.length > 0) {
       nextBtn.addEventListener('click', () => userInteract(currentSlide + 1));
       prevBtn.addEventListener('click', () => userInteract(currentSlide - 1));

       //  Dot Listeners
       dots.forEach((dot, index) => {
           dot.addEventListener('click', () => userInteract(index));
       });

       // Start the engine
       startAutoSlide();
   }

   // Emergency Pop-up 
   const emergencyModal = document.getElementById('emergencyModal');
   const closeModalBtn = document.getElementById('closeModal');

   if (emergencyModal && closeModalBtn) {
       // Show pop-up 1 second after page loads
       setTimeout(() => {
           emergencyModal.classList.add('show');
       }, 1000);

       // Close when "X" is clicked
       closeModalBtn.addEventListener('click', () => {
           emergencyModal.classList.remove('show');
       });

       // Close if clicked outside the image
       emergencyModal.addEventListener('click', (e) => {
           if (e.target === emergencyModal) {
               emergencyModal.classList.remove('show');
           }
       });
   }

   

}); 