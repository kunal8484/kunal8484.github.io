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
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
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
             if (event.key === 'Enter') {
                  const modalId = card.getAttribute("data-modal-target");
                  if (modalId) {
                      openModal(modalId);
                  }
             }
        });
        // Make card focusable
        card.setAttribute('tabindex', '0');
    });


    // Add click listener to each close button
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            closeModal(modal);
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

                // Optional: Update URL hash without jump after scrolling (for better history/bookmarking)
                // setTimeout(() => {
                //    history.pushState(null, null, targetId);
                // }, 500); // Adjust delay as needed

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
