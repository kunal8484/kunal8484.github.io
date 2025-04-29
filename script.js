document.addEventListener("DOMContentLoaded", () => {
    const projectCards = document.querySelectorAll(".project-card");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close-button");

    // Function to open a modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
            // Optional: Prevent background scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }
    }

    // Function to close a modal
    function closeModal(modal) {
        if (modal) {
            modal.style.display = "none";
             // Optional: Restore background scrolling
             document.body.style.overflow = 'auto';
        }
    }

    // Add click listener to each project card
    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            const modalId = card.getAttribute("data-modal-target");
            openModal(modalId);
        });
    });

    // Add click listener to each close button
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal"); // Find the parent modal
            closeModal(modal);
        });
    });

    // Add click listener to modal background (to close modal)
    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            // If the click is directly on the modal background (not the content)
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Optional: Close modal with the Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal);
                }
            });
        }
    });

});
