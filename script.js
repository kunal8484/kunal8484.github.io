document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       THEME TOGGLE (LIGHT / DARK)
       ========================================================= */
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
        });
    }


    /* =========================================================
       MODAL HANDLING
       ========================================================= */
    const projectCards = document.querySelectorAll(".project-card");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close-button");
    const body = document.body;

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
            body.style.overflow = 'hidden';
            const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = modal.querySelector('.close-button') || (focusable.length > 0 ? focusable[0] : null);
            if (firstElement) firstElement.focus();
        } else {
            console.error("Modal with ID: " + modalId + " not found.");
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = "none";
            body.style.overflow = 'auto';
        }
    }

    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            const modalId = card.getAttribute("data-modal-target");
            if (modalId) openModal(modalId);
        });
        card.addEventListener("keydown", (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const modalId = card.getAttribute("data-modal-target");
                if (modalId) openModal(modalId);
            }
        });
        if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", () => closeModal(button.closest(".modal")));
        button.addEventListener("keydown", (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                closeModal(button.closest(".modal"));
            }
        });
    });

    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal(modal);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const open = document.querySelector('.modal[style*="display: block"]');
            if (open) closeModal(open);
        }
    });


    /* =========================================================
       SMOOTH SCROLLING FOR NAV LINKS
       ========================================================= */
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - 15;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });


    /* =========================================================
       ELEVATOR BACK-TO-TOP
       ========================================================= */
    const backToTopBtn = document.getElementById('back-to-top');
    const overlay = document.getElementById('elevator-overlay');

    if (backToTopBtn) {

        let audioCtx = null;
        let isRiding = false;

        function makeNote(freq, startAt, duration, volume, type) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type || 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.0001, startAt);
            gain.gain.linearRampToValueAtTime(volume, startAt + 0.06);
            gain.gain.linearRampToValueAtTime(0.0001, startAt + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(startAt);
            osc.stop(startAt + duration + 0.05);
        }

        function startElevatorMusic(totalSeconds) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            audioCtx = new AudioCtx();

            // Gentle major-key lounge melody (C major)
            const melody = [
                523.25, 659.25, 587.33, 523.25,   // C5  E5  D5  C5
                493.88, 523.25, 587.33, 659.25,   // B4  C5  D5  E5
                698.46, 659.25, 587.33, 523.25,   // F5  E5  D5  C5
                493.88, 440.00, 493.88, 523.25    // B4  A4  B4  C5
            ];
            const bassLine = [130.81, 196.00, 174.61, 164.81]; // C3 G3 F3 E3

            const noteLen = 0.28;
            const barLen = melody.length * noteLen;
            const loops = Math.ceil(totalSeconds / barLen) + 1;
            const start = audioCtx.currentTime + 0.05;

            for (let loop = 0; loop < loops; loop++) {
                const loopStart = start + loop * barLen;
                melody.forEach((freq, i) => {
                    makeNote(freq, loopStart + i * noteLen, noteLen * 0.85, 0.07, 'sine');
                });
                bassLine.forEach((freq, i) => {
                    makeNote(freq, loopStart + i * noteLen * 4, noteLen * 3.6, 0.05, 'triangle');
                });
            }
        }

        function playArrivalBell() {
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            [1046.50, 1396.91].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const startAt = now + i * 0.16;
                gain.gain.setValueAtTime(0.22, startAt);
                gain.gain.exponentialRampToValueAtTime(0.0005, startAt + 1.6);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(startAt);
                osc.stop(startAt + 1.7);
            });
        }

        backToTopBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (isRiding) return;

    const startY = window.scrollY || window.pageYOffset;
    if (startY < 60) return; // already at the top

    isRiding = true;

    const duration = Math.min(2200, Math.max(1200, startY * 0.45));
    const startTime = performance.now();

    startElevatorMusic(duration / 1000);

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

        window.scrollTo(0, Math.round(startY * (1 - eased)));

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            window.scrollTo(0, 0);
            playArrivalBell();
            setTimeout(() => {
                if (audioCtx) {
                    audioCtx.close();
                    audioCtx = null;
                }
                isRiding = false;
            }, 1800);
        }
    }

    requestAnimationFrame(step);
});
    }

});
