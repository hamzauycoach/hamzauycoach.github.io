// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navControls = document.querySelector('.nav-controls');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navControls.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navControls.classList.remove('active');
    });
});

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
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const navUl = document.querySelector('nav ul');
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
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
            
            // Move the circle indicator
            const linkRect = link.getBoundingClientRect();
            const ulRect = navUl.getBoundingClientRect();
            const leftPosition = linkRect.left - ulRect.left + (linkRect.width / 2) - 40;
            
            navUl.style.setProperty('--indicator-left', `${leftPosition}px`);
        }
    });
}

// Set CSS variable for indicator position
navUl.style.setProperty('--indicator-left', '0px');

// Add CSS for the indicator movement
const style = document.createElement('style');
style.textContent = `
    nav ul::before {
        left: var(--indicator-left) !important;
    }
`;
document.head.appendChild(style);

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

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

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

// Language Toggle
const langToggle = document.getElementById('langToggle');
const html = document.documentElement;
let currentLang = 'en';

// Check for saved language preference
if (localStorage.getItem('language') === 'ar') {
    switchLanguage('ar');
}

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    switchLanguage(currentLang);
    localStorage.setItem('language', currentLang);
});

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update HTML lang and dir attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update button text
    const langText = langToggle.querySelector('.lang-text');
    langText.textContent = lang === 'en' ? 'AR' : 'EN';
    
    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
}