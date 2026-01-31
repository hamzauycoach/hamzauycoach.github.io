// Navbar Toggler - Bootstrap-style Collapse
const navbarToggler = document.getElementById('navbarToggle');
const navbarContent = document.getElementById('navbarContent');

if (navbarToggler && navbarContent) {
    navbarToggler.addEventListener('click', () => {
        // Toggle collapsed class on button
        navbarToggler.classList.toggle('collapsed');
        
        // Toggle collapse class on content
        navbarContent.classList.toggle('collapse');
        
        // Update aria-expanded
        const isExpanded = !navbarToggler.classList.contains('collapsed');
        navbarToggler.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navbarToggler.classList.add('collapsed');
                navbarContent.classList.add('collapse');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

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
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
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
window.addEventListener('scroll', () => {
    updateActiveLink();
});

// Update on click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(updateActiveLink, 100);
    });
});

// Navbar Color Change on Scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const pricingSection = document.getElementById('pricing');
    
    if (!nav) return;
    
    if (pricingSection) {
        const pricingTop = pricingSection.offsetTop;
        const pricingBottom = pricingTop + pricingSection.clientHeight;
        const scrollPos = window.scrollY + 100; // Offset for navbar height
        
        // Check if we're in the pricing section
        if (scrollPos >= pricingTop && scrollPos < pricingBottom) {
            nav.classList.remove('scrolled');
        } else if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    } else {
        // Fallback to original behavior
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});