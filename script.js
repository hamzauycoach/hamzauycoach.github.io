// Navbar Toggler - Improved Mobile Menu
const navbarToggler = document.getElementById('navbarToggle');
const navbarContent = document.getElementById('navbarContent');
const body = document.body;

if (navbarToggler && navbarContent) {
    navbarToggler.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Toggle collapsed class on button
        navbarToggler.classList.toggle('collapsed');
        
        // Toggle collapse class on content
        navbarContent.classList.toggle('collapse');
        
        // Update aria-expanded
        const isExpanded = !navbarToggler.classList.contains('collapsed');
        navbarToggler.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open on mobile
        if (window.innerWidth <= 768) {
            if (isExpanded) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        }
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navbarToggler.classList.add('collapsed');
                navbarContent.classList.add('collapse');
                navbarToggler.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInsideNav = navbarContent.contains(e.target) || navbarToggler.contains(e.target);
            const isExpanded = !navbarToggler.classList.contains('collapsed');
            
            if (!isClickInsideNav && isExpanded) {
                navbarToggler.classList.add('collapsed');
                navbarContent.classList.add('collapse');
                navbarToggler.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                body.style.overflow = '';
                navbarToggler.classList.add('collapsed');
                navbarContent.classList.add('collapse');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');

if (darkModeToggle) {
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Save preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Language Toggle
const langToggle = document.getElementById('langToggle');
const html = document.documentElement;
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update HTML lang and dir attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update button text
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = lang === 'en' ? 'AR' : 'EN';
        }
    }
    
    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
}

if (langToggle) {
    // Check for saved language preference
    if (localStorage.getItem('language') === 'ar') {
        switchLanguage('ar');
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        switchLanguage(currentLang);
        localStorage.setItem('language', currentLang);
    });
}

// FAQ Toggle Functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const wasActive = item.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!wasActive) {
            item.classList.add('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Indicator with Circle Animation
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const navbarNav = document.querySelector('.navbar-nav');
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    if (!navbarNav) return;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        
        if (href === currentSection) {
            link.classList.add('active');
            
            // Move the circle indicator (only on desktop)
            if (window.innerWidth > 768) {
                const linkRect = link.getBoundingClientRect();
                const navRect = navbarNav.getBoundingClientRect();
                const leftPosition = linkRect.left - navRect.left + (linkRect.width / 2) - 45;
                
                navbarNav.style.setProperty('--indicator-left', `${leftPosition}px`);
            }
        }
    });
}

// Set CSS variable for indicator position
if (navbarNav) {
    navbarNav.style.setProperty('--indicator-left', '0px');

    // Add CSS for the indicator movement
    const style = document.createElement('style');
    style.textContent = `
        .navbar-nav::before {
            left: var(--indicator-left) !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
window.addEventListener('load', () => {
    updateActiveLink();
});

// Update on scroll
let scrollTimer;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        updateActiveLink();
    }, 50);
});

// Update on click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(updateActiveLink, 100);
    });
});

// Navbar Color Change on Scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const pricingSection = document.getElementById('pricing');
    const currentScroll = window.scrollY;
    
    if (!nav) return;
    
    // Add/remove scrolled class for navbar background
    if (pricingSection) {
        const pricingTop = pricingSection.offsetTop;
        const pricingBottom = pricingTop + pricingSection.clientHeight;
        const scrollPos = currentScroll + 100;
        
        // Check if we're in the pricing section
        if (scrollPos >= pricingTop && scrollPos < pricingBottom) {
            nav.classList.remove('scrolled');
        } else if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    } else {
        // Fallback to original behavior
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    lastScroll = currentScroll;
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close menu on Escape key
    if (e.key === 'Escape' && navbarToggler && !navbarToggler.classList.contains('collapsed')) {
        navbarToggler.click();
    }
});

// Prevent iOS double-tap zoom on buttons
if ('ontouchstart' in window) {
    document.querySelectorAll('button, .btn').forEach(element => {
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        }, { passive: false });
    });
}