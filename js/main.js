// Global variables
let currentSlide = 0;
let slidesPerView = 1;

// DOM Elements
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__link');

// Initialize mobile menu
function initMobileMenu() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
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
    schoolCardsContainer.innerHTML = schoolData.map(school => `
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
                <div class="school-card__details">
                    <p><strong>Type:</strong> ${school.type}</p>
                    <p><strong>Grades:</strong> ${school.students}</p>
                    <p><strong>Programs:</strong> ${school.programs}</p>
                </div>
                <a href="#" class="button button--primary">Learn More</a>
            </div>
        </div>
    `).join('');
    
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
    initExhibitionSlider();
    initBackToTop();
    
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
