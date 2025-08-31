// Global variables
let currentSlide = 0;
let slidesPerView = 1;

// DOM Elements
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__link');
const headerEl = document.querySelector('.header');

// Initialize mobile menu
function initMobileMenu() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            // Reflect menu open state on header for styling
            if (headerEl) {
                const open = !isExpanded;
                headerEl.classList.toggle('header--menu-open', open);
            }
        });
    }


    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                if (headerEl) {
                    headerEl.classList.remove('header--menu-open');
                }
            }
        });
    });
}

// Header effects: transparent to solid on scroll
function initHeaderEffects() {
    const header = headerEl || document.querySelector('.header');
    if (!header) return;

    function onScroll() {
        if (window.scrollY > 10) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// Smooth vertical marquee for hero gallery columns
function initHeroGalleryMarquee() {
    const gallery = document.querySelector('.hero-gallery');
    if (!gallery) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const cols = Array.from(gallery.querySelectorAll('.hero-gallery__col'));
    if (!cols.length) return;

    // Prevent double-initialization
    if (gallery.dataset.marqueeInit === 'true') return;
    gallery.dataset.marqueeInit = 'true';

    const speeds = [0.25, 0.35, 0.3]; // px per frame per column
    const directions = [1, 1, 1]; // all columns move upward (bottom -> top)

    const tracks = cols.map((col, i) => {
        // Ensure any pre-existing CSS animations don't conflict
        col.style.animation = 'none';
        // If already has a track, reuse
        let track = col.querySelector('.hero-gallery__track');
        if (!track) {
            track = document.createElement('div');
            track.className = 'hero-gallery__track';
            // move all children into track
            const children = Array.from(col.children);
            children.forEach(ch => track.appendChild(ch));
            // duplicate content for seamless loop
            track.innerHTML += track.innerHTML;
            col.appendChild(track);
        }

        // Basic layout styles (avoid extra CSS file edits)
        track.style.display = 'grid';
        track.style.gap = getComputedStyle(col).gap || '1.25rem';
        track.style.willChange = 'transform';

        return {
            col,
            track,
            speed: speeds[i] ?? 0.3,
            dir: directions[i] ?? 1,
            offset: 0
        };
    });

    let rafId;
    function step() {
        tracks.forEach(t => {
            // Height of one set of items (half, because duplicated)
            const singleHeight = t.track.scrollHeight / 2;
            t.offset += t.speed * t.dir;
            if (t.offset >= singleHeight) t.offset = 0;
            if (t.offset <= -singleHeight) t.offset = 0;
            t.track.style.transform = `translateY(${-t.offset}px)`;
        });
        rafId = requestAnimationFrame(step);
    }

    step();

    // Stop animation if user switches to reduced motion
    reduced.addEventListener?.('change', e => {
        if (e.matches && rafId) cancelAnimationFrame(rafId);
    });
}

// Initialize hero slider
function initHeroSlider() {
    const heroSlider = document.querySelector('.hero__slider');
    const heroPagination = document.querySelector('.hero__pagination');
    const prevButton = document.querySelector('.hero__control--prev');
    const nextButton = document.querySelector('.hero__control--next');
    
    // Only require the slider element; controls are optional
    if (!heroSlider) return;
    
    const heroSlides = [
        {
            title: 'Welcome to Premier Schools Exhibition',
            subtitle: 'Discover the best educational institutions in one place',
            buttonText: 'Explore Schools',
            buttonLink: '#schools'
        },
        {
            title: 'Find the Perfect School',
            subtitle: 'Browse through our curated list of top-rated schools',
            buttonText: 'View Schools',
            buttonLink: '#schools'
        },
        {
            title: 'Upcoming Events',
            subtitle: 'Join our exhibition to meet school representatives',
            buttonText: 'View Events',
            buttonLink: '#exhibition'
        }
    ];
    
    // Create slides
    heroSlider.innerHTML = heroSlides.map((slide, index) => `
        <div class="hero__slide" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${heroSlides.length}">
            <div class="hero__content">
                <h2 class="hero__title">${slide.title}</h2>
                <p class="hero__subtitle">${slide.subtitle}</p>
                <a href="${slide.buttonLink}" class="button button--primary">${slide.buttonText}</a>
            </div>
        </div>
    `).join('');
    
    // Create pagination only if container exists
    let paginationButtons = [];
    if (heroPagination) {
        heroPagination.innerHTML = Array.from({ length: heroSlides.length })
            .map((_, i) => `
                <button type="button" class="hero__pagination-button" 
                        aria-label="Go to slide ${i + 1}" ${i === 0 ? 'aria-current="true"' : ''}>
                    <span class="visually-hidden">Slide ${i + 1}</span>
                </button>
            `).join('');
        paginationButtons = Array.from(heroPagination.querySelectorAll('.hero__pagination-button'));
    }
    
    const slides = Array.from(heroSlider.children);
    
    function updateSlider() {
        const offset = -currentSlide * 100;
        heroSlider.style.transform = `translateX(${offset}%)`;
        
        // Update pagination
        if (paginationButtons.length) {
            paginationButtons.forEach((button, i) => {
                if (i === currentSlide) {
                    button.classList.add('active');
                    button.setAttribute('aria-current', 'true');
                } else {
                    button.classList.remove('active');
                    button.removeAttribute('aria-current');
                }
            });
        }
    }
    
    function goToSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        updateSlider();
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Event listeners
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    
    paginationButtons.forEach((button, index) => {
        button.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-advance slides
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    heroSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    heroSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Initialize slider
    updateSlider();
}

// Initialize school logos slider
function initSchoolLogos() {
    const logosContainer = document.querySelector('.school-logos__track');
    if (!logosContainer) return;
    
    const logos = [
        { src: 'assets/images/school-1.svg', alt: 'Greenwood Academy' },
        { src: 'assets/images/school-2.svg', alt: 'Riverside High' },
        { src: 'assets/images/school-3.svg', alt: 'Sunshine Elementary' },
        { src: 'assets/images/logo.svg', alt: 'Premier Schools Exhibition' },
        { src: 'assets/images/exhibition-1.svg', alt: 'Science & Technology' },
        { src: 'assets/images/exhibition-2.svg', alt: 'Arts & Culture' },
        { src: 'assets/images/football-157930_1280.png', alt: 'Pinecrest Academy' },
        { src: 'assets/images/graduation-157929_1280.png', alt: 'Hillside School' }
    ];
    
    // Create logo elements
    const logoElements = logos.map(logo => `
        <div class="school-logos__slide">
            <img 
                src="${logo.src}" 
                alt="${logo.alt}" 
                width="160" 
                height="80"
                loading="lazy"
            >
        </div>
    `).join('');
    
    // Duplicate logos for infinite loop effect
    logosContainer.innerHTML = logoElements + logoElements;
    
    // Animate logos
    let position = 0;
    const speed = 0.5;
    const logosTrack = document.querySelector('.school-logos__track');
    
    function animate() {
        position -= speed;
        if (position <= -50) position = 0;
        logosTrack.style.transform = `translateX(${position}%)`;
        requestAnimationFrame(animate);
    }
    
    // Start animation
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(animate);
    }
}

// Initialize school cards
function initSchoolCards() {
    const schoolCardsContainer = document.querySelector('.school-cards');
    if (!schoolCardsContainer) return;
    
    const schoolData = [
        {
            name: 'Greenwood Academy',
            location: 'New York, NY',
            description: 'A leading institution with a focus on STEM education and arts integration.',
            image: 'assets/images/events/event-4.jpg',
            rating: 4.5,
            type: 'Private',
            students: 'K-12',
            programs: 'STEM, Arts, Sports'
        },
        {
            name: 'Riverside High',
            location: 'Los Angeles, CA',
            description: 'Dedicated to academic excellence and character development.',
            image: 'assets/images/events/event-5.jpg',
            rating: 4.2,
            type: 'Public',
            students: '9-12',
            programs: 'AP, Sports, Arts'
        },
        {
            name: 'Sunshine Elementary',
            location: 'Miami, FL',
            description: 'Nurturing young minds through innovative learning approaches.',
            image: 'assets/images/events/event-6.jpg',
            rating: 4.7,
            type: 'Public',
            students: 'K-5',
            programs: 'Gifted, Special Needs'
        },
        {
            name: 'Mountain View School',
            location: 'Denver, CO',
            description: 'Emphasizing outdoor education and environmental stewardship.',
            image: 'assets/images/events/event-7.jpg',
            rating: 4.3,
            type: 'Charter',
            students: 'K-8',
            programs: 'Outdoor Education, STEM'
        }
    ];
    
    // Create school cards
    schoolCardsContainer.innerHTML = schoolData.map(school => {
        const chips = (school.programs || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(txt => `<span class="chip">${txt}</span>`)
            .join('');
        return `
        <div class="school-card">
            <div class="school-card__image">
                <img src="${school.image}" alt="${school.name}" loading="lazy">
            </div>
            <div class="school-card__content">
                <h3 class="school-card__title">${school.name}</h3>
                <div class="school-card__meta">
                    <span class="school-card__location">${school.location}</span>
                    <span class="school-card__rating">
                        ${'★'.repeat(Math.floor(school.rating))}${'☆'.repeat(5 - Math.floor(school.rating))}
                        <span class="visually-hidden">${school.rating} out of 5 stars</span>
                    </span>
                </div>
                <p class="school-card__description">${school.description}</p>
                <div class="school-card__tags" aria-label="Programs">${chips}</div>
                <div class="school-card__details">
                    <p><strong>Type:</strong> ${school.type}</p>
                    <p><strong>Grades:</strong> ${school.students}</p>
                    <p><strong>Programs:</strong> ${school.programs}</p>
                </div>
                <a href="#" class="button button--primary">Learn More</a>
            </div>
        </div>`;
    }).join('');

    // Enhance interactions: tilt and reveal-on-scroll
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = Array.from(schoolCardsContainer.querySelectorAll('.school-card'));

    // Reveal on scroll
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = Number(entry.target.dataset.idx || 0);
                entry.target.style.transitionDelay = `${Math.min(idx * 70, 420)}ms`;
                entry.target.classList.add('is-inview');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    cards.forEach((card, i) => { card.dataset.idx = String(i); io.observe(card); });

    // Tilt on hover (skip on touch and reduced motion)
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch && !reducedMotion) {
        const maxTilt = 6; // deg
        cards.forEach(card => {
            let rafId;
            function onMove(e) {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                const ry = Math.max(-1, Math.min(1, dx)) * maxTilt; // rotateY by horizontal
                const rx = Math.max(-1, Math.min(1, -dy)) * maxTilt; // rotateX by vertical
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
                    card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
                    // Glare position (percentages within card)
                    const mx = ((e.clientX - rect.left) / rect.width) * 100;
                    const my = ((e.clientY - rect.top) / rect.height) * 100;
                    card.style.setProperty('--mx', mx.toFixed(2) + '%');
                    card.style.setProperty('--my', my.toFixed(2) + '%');
                    // Parallax image translation
                    const tx = Math.max(-1, Math.min(1, dx)) * 10; // px
                    const ty = Math.max(-1, Math.min(1, dy)) * 10; // px
                    card.style.setProperty('--tx', tx.toFixed(1) + 'px');
                    card.style.setProperty('--ty', ty.toFixed(1) + 'px');
                });
            }
            function resetTilt() {
                if (rafId) cancelAnimationFrame(rafId);
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
                card.style.setProperty('--mx', '50%');
                card.style.setProperty('--my', '50%');
                card.style.setProperty('--tx', '0px');
                card.style.setProperty('--ty', '0px');
            }
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', resetTilt);
            card.addEventListener('focusout', resetTilt);
        });
    }

    // Initialize mobile slider if needed
    if (window.innerWidth < 1024) {
        initSchoolCardsSlider();
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth < 1024) {
                initSchoolCardsSlider();
            } else {
                const slider = document.querySelector('.school-cards');
                if (slider) {
                    slider.style.transform = 'none';
                    slider.style.gap = '';
                }
            }
        }, 250);
    });
    
    function initSchoolCardsSlider() {
        const slider = document.querySelector('.school-cards');
        if (!slider) return;
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = 'grabbing';
        });
        
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }
}

// Initialize exhibition slider
function initExhibitionSlider() {
    const exhibitionSlider = document.querySelector('.exhibition-slider');
    if (!exhibitionSlider) return;
    
    const events = [
        {
            title: 'Science Fair 2023',
            date: 'October 15, 2023',
            time: '10:00 AM - 4:00 PM',
            location: 'Convention Center, Hall A',
            description: 'Explore innovative projects from top schools in the region. Featuring robotics demonstrations, science experiments, and interactive exhibits.',
            image: 'assets/images/events/event-4.jpg',
            category: 'Science & Technology'
        },
        {
            title: 'Art Exhibition',
            date: 'November 5, 2023',
            time: '11:00 AM - 6:00 PM',
            location: 'City Art Gallery',
            description: 'Showcasing student artwork from participating schools. Includes paintings, sculptures, digital art, and mixed media installations.',
            image: 'assets/images/events/event-1.jpg',
            category: 'Arts & Culture'
        },
        {
            title: 'Sports Day',
            date: 'November 20, 2023',
            time: '9:00 AM - 3:00 PM',
            location: 'City Sports Complex',
            description: 'Inter-school sports competition featuring track and field events, team sports, and athletic demonstrations.',
            image: 'assets/images/events/event-2.jpg',
            category: 'Sports'
        },
        {
            title: 'Music Festival',
            date: 'December 10, 2023',
            time: '6:00 PM - 9:00 PM',
            location: 'City Auditorium',
            description: 'An evening of musical performances by school bands, orchestras, and choirs. Featuring classical, jazz, and contemporary pieces.',
            image: 'assets/images/events/event-3.jpg',
            category: 'Performing Arts'
        }
    ];
    
    // Create event cards
    exhibitionSlider.innerHTML = events.map(event => `
        <div class="exhibition-card">
            <div class="exhibition-card__image">
                <img src="${event.image}" alt="${event.title}" loading="lazy">
                <span class="exhibition-card__category">${event.category}</span>
            </div>
            <div class="exhibition-card__content">
                <h3 class="exhibition-card__title">${event.title}</h3>
                <div class="exhibition-card__meta">
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                </div>
                <div class="exhibition-card__details">
                    <p><strong>Location:</strong> ${event.location}</p>
                </div>
                <p class="exhibition-card__description">${event.description}</p>
                <div class="exhibition-card__actions">
                    <a href="#" class="button button--primary">View Details</a>
                    <a href="#register" class="button button--secondary">Register</a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize slider controls
    const prevButton = document.querySelector('.exhibition-slider__control--prev');
    const nextButton = document.querySelector('.exhibition-slider__control--next');
    const pagination = document.querySelector('.exhibition-slider__pagination');
    
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.exhibition-card');
    const visibleSlides = calculateVisibleSlides();
    
    // Create pagination
    if (pagination) {
        const pageCount = Math.ceil(slides.length / visibleSlides);
        pagination.innerHTML = Array.from({ length: pageCount })
            .map((_, i) => `
                <button type="button" class="exhibition-slider__pagination-button" 
                        aria-label="Go to slide ${i + 1}" ${i === 0 ? 'aria-current="true"' : ''}>
                    <span class="visually-hidden">Slide ${i + 1}</span>
                </button>
            `).join('');
    }
    
    function updateSlider() {
        const slideWidth = slides[0].offsetWidth + 32; // 32px gap
        const offset = -currentSlideIndex * slideWidth * visibleSlides;
        exhibitionSlider.style.transform = `translateX(${offset}px)`;
        
        // Update pagination
        if (pagination) {
            const buttons = pagination.querySelectorAll('button');
            buttons.forEach((button, index) => {
                if (index === currentSlideIndex) {
                    button.classList.add('active');
                    button.setAttribute('aria-current', 'true');
                } else {
                    button.classList.remove('active');
                    button.removeAttribute('aria-current');
                }
            });
        }
    }
    
    function goToSlide(index) {
        const maxSlide = Math.max(0, Math.ceil(slides.length / visibleSlides) - 1);
        currentSlideIndex = Math.max(0, Math.min(index, maxSlide));
        updateSlider();
    }
    
    function nextSlide() {
        const maxSlide = Math.max(0, Math.ceil(slides.length / visibleSlides) - 1);
        if (currentSlideIndex < maxSlide) {
            currentSlideIndex++;
            updateSlider();
        }
    }
    
    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlider();
        }
    }
    
    function calculateVisibleSlides() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1200) return 2;
        return 3;
    }
    
    // Event listeners
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    
    if (pagination) {
        pagination.querySelectorAll('button').forEach((button, index) => {
            button.addEventListener('click', () => goToSlide(index));
        });
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newVisibleSlides = calculateVisibleSlides();
            if (newVisibleSlides !== visibleSlides) {
                currentSlideIndex = 0;
                updateSlider();
            }
        }, 250);
    });
    
    // Initialize slider
    updateSlider();
}

// Initialize all components
function init() {
    initHeroSlider();
    initSchoolLogos();
    initSchoolCards();
    initBackToTop();
    initHeaderEffects();
    initHeroGalleryMarquee();
    initExhibitionRailAutoScroll();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                }
            }
        });
    });
    
    // Handle reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    }
    
    // Add loaded class to body when everything is loaded
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    init();
});

// Back to Top button
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function toggleVisibility() {
        const threshold = 300; // px scrolled
        if (window.scrollY > threshold) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', () => {
        if (reducedMotion.matches) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Auto-scroll the exhibition mini-cards rail (no slider controls)
function initExhibitionRailAutoScroll() {
    const rail = document.querySelector('.exhibition-rail');
    const track = document.querySelector('.exhibition-rail__track');
    if (!rail || !track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    // Prevent double initialization
    if (track.dataset.autoScrollInit === 'true') return;
    track.dataset.autoScrollInit = 'true';

    // Duplicate once for seamless loop
    track.innerHTML += track.innerHTML;

    let rafId;
    let paused = false;
    const speed = 0.6; // px per frame

    // Cache original scroll-snap setting so we can restore it on pause
    const originalSnap = getComputedStyle(track).scrollSnapType || '';
    function disableSnap() {
        track.style.scrollSnapType = 'none';
    }
    function restoreSnap() {
        // Restore only if there was an original value
        track.style.scrollSnapType = originalSnap || '';
    }

    function step() {
        if (!paused) {
            // Avoid snap fighting the automated motion
            disableSnap();
            track.scrollLeft += speed;
            const halfWidth = Math.max(0, (track.scrollWidth / 2) - track.clientWidth);
            if (track.scrollLeft >= halfWidth) {
                track.scrollLeft = 0;
            }
        }
        rafId = requestAnimationFrame(step);
    }

    // Pause on hover/focus for accessibility
    rail.addEventListener('mouseenter', () => { paused = true; restoreSnap(); });
    rail.addEventListener('mouseleave', () => { paused = false; });
    rail.addEventListener('focusin', () => { paused = true; restoreSnap(); });
    rail.addEventListener('focusout', () => { paused = false; });

    // Kick off
    step();

    // React to reduced motion changes
    reduced.addEventListener?.('change', e => {
        if (e.matches && rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!e.matches && !rafId) {
            step();
        }
    });
}
