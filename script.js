document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const proposalSection = document.getElementById('proposal-section');
    const celebrationSection = document.getElementById('celebration-section');
    const particlesContainer = document.getElementById('particles-container');

    // 1. "No" Button Evasive Behavior
    const moveNoButton = () => {
        // Calculate random position within the viewport
        // Subtract button dimensions to keep it within view
        const padding = 20;
        const maxX = window.innerWidth - noBtn.offsetWidth - padding;
        const maxY = window.innerHeight - noBtn.offsetHeight - padding;

        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
        noBtn.style.zIndex = '1000';
    };

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('click', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent accidental selection on mobile
        moveNoButton();
    });

    // 2. "Yes" Button Celebration
    yesBtn.addEventListener('click', () => {
        // Hide proposal, show celebration
        proposalSection.classList.add('hidden');
        celebrationSection.classList.remove('hidden');
        
        // Trigger Confetti
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // Continuous hearts burst
        setInterval(createHeart, 300);
    });

    // 3. Dynamic Floating Hearts Background
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        
        // Random properties
        const startX = Math.random() * 100;
        const duration = 5 + Math.random() * 10;
        const size = 10 + Math.random() * 20;
        const opacity = 0.3 + Math.random() * 0.5;

        heart.style.left = `${startX}vw`;
        heart.style.bottom = `-50px`; // Start below screen
        heart.style.animationDuration = `${duration}s`;
        heart.style.fontSize = `${size}px`;
        heart.style.opacity = opacity;

        particlesContainer.appendChild(heart);

        // Remove heart after animation ends
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // 4. Music Player Logic
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    const toggleMusic = () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            musicBtn.querySelector('.music-icon').innerHTML = '🔇 Music Paused';
        } else {
            bgMusic.play().catch(e => console.log("Autoplay prevented, waiting for interaction"));
            musicBtn.classList.add('playing');
            musicBtn.querySelector('.music-icon').innerHTML = '🎵 Love Song';
        }
        isPlaying = !isPlaying;
    };

    musicBtn.addEventListener('click', toggleMusic);

    // 5. Scroll & Side Dots Logic
    const scrollContainer = document.querySelector('.scroll-container');
    const sections = document.querySelectorAll('.full-page');
    const dots = document.querySelectorAll('.dot');

    scrollContainer.addEventListener('scroll', () => {
        let current = 0;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            if (scrollContainer.scrollTop >= sectionTop - window.innerHeight / 2) {
                current = index;
            }
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === current);
        });

        // Try start music on first scroll
        if (!isPlaying && scrollContainer.scrollTop > 50) {
            toggleMusic();
        }
    }, { passive: true });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionIndex = dot.getAttribute('data-section');
            sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Initial background hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, Math.random() * 3000);
    }
    
    // Periodically add new hearts to background
    setInterval(createHeart, 2000);

    // Interactive Cards - Add subtle click feedback
    const cards = document.querySelectorAll('.moment-card, .reason-tag');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
            
            // Emoji burst on card click
            const rect = card.getBoundingClientRect();
            for(let i=0; i<5; i++) {
                createMiniHeart(rect.left + rect.width/2, rect.top + rect.height/2);
            }
        });
    });

    function createMiniHeart(x, y) {
        const mini = document.createElement('div');
        mini.innerHTML = '❤️';
        mini.style.position = 'fixed';
        mini.style.left = `${x}px`;
        mini.style.top = `${y}px`;
        mini.style.pointerEvents = 'none';
        mini.style.transition = 'all 0.6s ease-out';
        mini.style.zIndex = '2000';
        document.body.appendChild(mini);

        setTimeout(() => {
            mini.style.transform = `translate(${(Math.random()-0.5)*100}px, ${(Math.random()-0.5)*100}px) scale(0)`;
            mini.style.opacity = '0';
        }, 10);

        setTimeout(() => mini.remove(), 700);
    }
});
