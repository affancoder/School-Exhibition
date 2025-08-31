document.addEventListener('DOMContentLoaded', () => {
    // 3D Tilt Effect with GSAP
    const cards = document.querySelectorAll('.exhibition-mini');
    
    cards.forEach(card => {
        // Add glass effect class
        card.classList.add('glass-effect');
        
        // Add perspective to the card container
        gsap.set(card, { transformPerspective: 1000 });
        
        // Mouse move effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            gsap.to(card, {
                rotationY: rotateY * 0.5,
                rotationX: rotateX * 0.5,
                ease: 'power1.out',
                duration: 0.5
            });
            
            // Parallax effect for image
            const img = card.querySelector('img');
            const moveX = (x - centerX) * 0.01;
            const moveY = (y - centerY) * 0.01;
            
            gsap.to(img, {
                x: moveX * 5,
                y: moveY * 5,
                scale: 1.05,
                duration: 0.5,
                ease: 'power1.out'
            });
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                ease: 'elastic.out(1, 0.3)',
                duration: 1
            });
            
            gsap.to(card.querySelector('img'), {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power1.out'
            });
        });
    });
});
