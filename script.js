document.addEventListener('DOMContentLoaded', function() {
    // Portfolio Tab Navigation
    const tabs = document.querySelectorAll('.portfolio-tabs .tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
    
    // Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formElements = this.elements;
            const name = formElements[0].value;
            
            // Here you would typically send the form data to a server
            // For GitHub Pages, you might use Formspree or a similar service
            
            // Show success message
            alert(`Thanks ${name}! Your message has been sent. I'll get back to you soon.`);
            this.reset();
        });
    }
    
    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add Animation on Scroll
    const animateElements = document.querySelectorAll('.project-card, .case-study-card, .experience-item');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Function to animate elements in viewport
    function animateOnScroll() {
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Run on initial load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Notion-like features
    
    // 1. Hover effect on navigation items
    const navItems = document.querySelectorAll('.search i, .actions i');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.color = '#ffffff';
        });
        item.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    });
    
    // 2. Current year in footer (if needed)
    const
