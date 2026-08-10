document.addEventListener("DOMContentLoaded", () => {

    // --- Modal Handling Logic ---
    const projectCards = document.querySelectorAll(".project-card");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close-button");
    const body = document.body;

    // Function to open a modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
            body.style.overflow = 'hidden'; // Prevent background scrolling
            // Focus management (optional but good for accessibility)
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            // Find first focusable element, typically the close button or title link
            const firstElement = modal.querySelector('.close-button') || (focusableElements.length > 0 ? focusableElements[0] : null);
            if(firstElement) {
                firstElement.focus();
            }

        } else {
            console.error("Modal with ID: " + modalId + " not found.");
        }
    }

    // Function to close a modal
    function closeModal(modal) {
        if (modal) {
            modal.style.display = "none";
            body.style.overflow = 'auto'; // Restore background scrolling
        }
    }

    // Add click listener to each project card
    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            const modalId = card.getAttribute("data-modal-target");
            if (modalId) {
                openModal(modalId);
            } else {
                console.error("Project card is missing data-modal-target attribute:", card);
            }
        });
        // Add keyboard accessibility (Enter key)
        card.addEventListener("keydown", (event) => {
             if (event.key === 'Enter' || event.key === ' ') { // Also allow spacebar
                  event.preventDefault(); // Prevent page scrolling on spacebar
                  const modalId = card.getAttribute("data-modal-target");
                  if (modalId) {
                      openModal(modalId);
                  }
             }
        });
        // Make card focusable if it wasn't already via tabindex="0" in HTML
        if (!card.hasAttribute('tabindex')) {
             card.setAttribute('tabindex', '0');
        }
    });


    // Add click listener to each close button
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            closeModal(modal);
        });
         // Add keyboard accessibility (Enter/Space key) for close button
         button.addEventListener("keydown", (event) => {
             if (event.key === 'Enter' || event.key === ' ') {
                 event.preventDefault();
                 const modal = button.closest(".modal");
                 closeModal(modal);
             }
         });
    });

    // Add click listener to modal background (to close modal)
    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) { // Check if the click is directly on the modal overlay
                closeModal(modal);
            }
        });
    });

    // Close modal with the Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="display: block"]'); // Find the currently open modal
            if (openModal) {
                closeModal(openModal);
            }
        }
    });


    // --- Smooth Scrolling Logic ---
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]'); // Select only internal nav links

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                 e.preventDefault(); // Prevent default jump only if target exists

                // Calculate scroll position, accounting for sticky nav height
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0; // Get nav height or default to 0
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - 15; // Add a little extra offset (15px)

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

            } else {
                 console.warn("Smooth scroll target not found:", targetId);
            }
        });
    });

     // --- Back to Top Link Smooth Scroll ---
     const backToTopLink = document.querySelector('footer a[href="#"]');
     if (backToTopLink) {
          backToTopLink.addEventListener('click', function(e) {
               e.preventDefault();
               window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
               });
          });
     }


}); // End of DOMContentLoaded listener

// ===== DARK / LIGHT MODE =====
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

        themeToggle.addEventListener('click', function () {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
        });
    }

    // ===== ELEVATOR BACK-TO-TOP =====
    const backToTopBtn = document.getElementById('back-to-top');
    const overlay = document.getElementById('elevator-overlay');
    const floorDisplay = document.getElementById('elevator-floor');

    if (backToTopBtn && overlay && floorDisplay) {
        function playElevatorSound() {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            const audioCtx = new AudioCtx();

            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc1.type = 'sine';
            osc1.frequency.value = 220;
            osc2.type = 'sine';
            osc2.frequency.value = 225;

            gain.gain.value = 0.03;
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start();
            osc2.start();

            return { audioCtx, osc1, osc2, gain };
        }

        function playBellDing(audioCtx) {
            const now = audioCtx.currentTime;
            [880, 1320].forEach(function (freq) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 1.2);
            });
        }

        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const startY = window.scrollY;
            const duration = Math.min(4000, Math.max(1800, startY * 1.2));
            const startTime = performance.now();

            overlay.classList.add('active');
            const sound = playElevatorSound();

            function animateScroll(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                window.scrollTo(0, startY * (1 - eased));

                const floorsTotal = 5;
                const currentFloor = Math.max(1, Math.ceil(floorsTotal * (1 - eased)));
                floorDisplay.textContent = progress < 1 ? currentFloor : 'L';

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    if (sound) {
                        sound.osc1.stop();
                        sound.osc2.stop();
                        playBellDing(sound.audioCtx);
                    }
                    setTimeout(function () {
                        overlay.classList.remove('active');
                        if (sound) sound.audioCtx.close();
                    }, 1300);
                }
            }

            requestAnimationFrame(animateScroll);
        });
    }
});
