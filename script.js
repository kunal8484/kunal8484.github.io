document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality for portfolio section
    const tabs = document.querySelectorAll('.tab');
    const categoryProjects = document.querySelectorAll('.category-projects');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all category projects
            categoryProjects.forEach(category => {
                category.classList.remove('active');
            });
            
            // Show the selected category projects
            const category = this.getAttribute('data-category');
            document.getElementById(`${category}-projects`).classList.add('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // For GitHub Pages, you would typically use a service like Formspree
            // Example: https://formspree.io/
            // Here's how you might set it up:
            
            // const formData = new FormData();
            // formData.append('name', name);
            // formData.append('email', email);
            // formData.append('message', message);
            
            // fetch('https://formspree.io/f/yourformid', {
            //     method: 'POST',
            //     body: formData,
            //     headers: {
            //         'Accept': 'application/json'
            //     }
            // }).then(response => {
            //     if (response.ok) {
            //         alert(`Thanks ${name}! Your message has been sent. I'll get back to you soon.`);
            //         contactForm.reset();
            //     } else {
            //         alert('Oops! There was a problem sending your message.');
            //     }
            // }).catch(error => {
            //     alert('Oops! There was a problem sending your message.');
            // });
            
            // For now, just show a success message
            alert(`Thanks ${name}! Your message has been sent. I'll get back to you soon.`);
            contactForm.reset();
        });
    }
    
    // Add animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.project-card, .experience-item, .case-study-card');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            // If element is in viewport
            if (position.top < window.innerHeight && position.bottom >= 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial state for animations
    document.querySelectorAll('.project-card, .experience-item, .case-study-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Typing effect for hero section (optional)
    const heroText = document.querySelector('.hero-text h2');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Uncomment to enable typing effect
        // typeWriter();
    }
    
    // Add current year to footer copyright
    const yearSpan = document.querySelector('.footer-content p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = `&copy; ${currentYear} Kunal Pingale. All rights reserved.`;
    }
    
    // Add GitHub Pages form compatibility
    // Since GitHub Pages doesn't process server-side code, you can use a third-party service
    // For example, you can use FormSpree (https://formspree.io/)
    // This requires adding your FormSpree endpoint to the form's action attribute
}
