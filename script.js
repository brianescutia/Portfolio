/**
 * Portfolio Website JavaScript - Enhanced Version
 * Author: Brian Escutia
 * Description: Complete animations, interactions, and dynamic features
 */

// ===========================
// Global Variables
// ===========================

const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const fadeElements = document.querySelectorAll('.fade-in');
const contactForm = document.getElementById('contactForm');
const themeToggle = document.getElementById('themeToggle');
const backToTopBtn = document.getElementById('backToTop');
const preloader = document.getElementById('preloader');
const typingText = document.getElementById('typingText');

// Upload elements
const resumeBtn = document.getElementById('resumeBtn');
const resumeUpload = document.getElementById('resumeUpload');
const uploadModal = document.getElementById('uploadModal');
const imageUpload = document.getElementById('imageUpload');
const uploadArea = document.getElementById('uploadArea');

// Typing animation variables
const roles = ['Software Engineer', 'Full-Stack Developer', 'Problem Solver'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

// ===========================
// Core Functions
// ===========================

/**
 * Initialize preloader
 */
function initPreloader() {
    // Show preloader on page load
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                preloader.style.display = 'none';
                // Start animations after preloader
                initScrollAnimations();
                startTypingAnimation();
            }, 500);
        }, 1500); // Show loader for at least 1.5 seconds
    });
}

/**
 * Advanced typing animation with delete effect
 */
function startTypingAnimation() {
    if (!typingText) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        // Remove characters
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Faster when deleting
    } else {
        // Add characters
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Normal speed when typing
    }
    
    // Check if word is complete
    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end of word
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Move to next word
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
    }
    
    setTimeout(startTypingAnimation, typingSpeed);
}

/**
 * Enhanced theme toggle with localStorage
 */
function initThemeToggle() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class for smooth theme change
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Remove transition after animation
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

/**
 * Update theme icon based on current theme
 */
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun'; // Show sun icon in dark mode
    } else {
        icon.className = 'fas fa-moon'; // Show moon icon in light mode
    }
}

/**
 * Back to Top button functionality
 */
function initBackToTop() {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Sticky navigation with enhanced effects
 */
function handleStickyNavbar() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Resume upload functionality
 */
function initResumeUpload() {
    // Store resume in localStorage
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const savedResume = localStorage.getItem('resumePath');
        
        if (savedResume) {
            // Download saved resume
            const link = document.createElement('a');
            link.href = savedResume;
            link.download = 'BrianEscutiaResume.pdf';
            link.click();
        } else {
            // Trigger file upload
            resumeUpload.click();
        }
    });
    
    resumeUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Save to localStorage (base64)
                localStorage.setItem('resumePath', e.target.result);
                localStorage.setItem('resumeName', file.name);
                showNotification('Resume uploaded successfully!', 'success');
                
                // Update button text
                resumeBtn.innerHTML = '<i class="fas fa-download"></i> Resume';
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Please upload a PDF file', 'error');
        }
    });
}

/**
 * Image upload for projects
 */
function initImageUpload() {
    // Add upload buttons to each project card
    document.querySelectorAll('.project-card').forEach((card, index) => {
        const projectIcon = card.querySelector('.project-icon');
        
        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'project-image-container';
        imageContainer.style.display = 'none';
        
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'image-upload-btn';
        uploadBtn.innerHTML = '<i class="fas fa-camera"></i>';
        uploadBtn.onclick = () => openImageUpload(index);
        
        imageContainer.appendChild(uploadBtn);
        card.insertBefore(imageContainer, projectIcon.nextSibling);
        
        // Check for saved image
        const savedImage = localStorage.getItem(`project-image-${index}`);
        if (savedImage) {
            displayProjectImage(index, savedImage);
        }
    });
}

/**
 * Open image upload modal
 */
function openImageUpload(projectIndex) {
    uploadModal.classList.add('show');
    uploadModal.dataset.projectIndex = projectIndex;
    
    // Close modal handlers
    document.querySelector('.close-modal').onclick = () => {
        uploadModal.classList.remove('show');
    };
    
    uploadModal.onclick = (e) => {
        if (e.target === uploadModal) {
            uploadModal.classList.remove('show');
        }
    };
}

/**
 * Handle image drag and drop
 */
function initDragAndDrop() {
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleImageFiles(e.dataTransfer.files);
    });
    
    imageUpload.addEventListener('change', (e) => {
        handleImageFiles(e.target.files);
    });
    
    // Save images button
    document.getElementById('saveImages').addEventListener('click', () => {
        const projectIndex = uploadModal.dataset.projectIndex;
        const images = document.querySelectorAll('#uploadedImages img');
        
        if (images.length > 0) {
            const imageSrc = images[0].src; // Use first image as main
            localStorage.setItem(`project-image-${projectIndex}`, imageSrc);
            displayProjectImage(projectIndex, imageSrc);
            uploadModal.classList.remove('show');
            showNotification('Image saved successfully!', 'success');
        }
    });
}

/**
 * Handle uploaded image files
 */
function handleImageFiles(files) {
    const uploadedImagesDiv = document.getElementById('uploadedImages');
    uploadedImagesDiv.innerHTML = '';
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'lazy-image';
                uploadedImagesDiv.appendChild(img);
                
                // Add loaded class after image loads
                img.onload = () => {
                    img.classList.add('loaded');
                };
            };
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Display project image
 */
function displayProjectImage(projectIndex, imageSrc) {
    const projectCard = document.querySelectorAll('.project-card')[projectIndex];
    const imageContainer = projectCard.querySelector('.project-image-container');
    
    if (imageContainer) {
        imageContainer.style.display = 'block';
        
        // Remove existing image if any
        const existingImg = imageContainer.querySelector('.project-image');
        if (existingImg) {
            existingImg.remove();
        }
        
        // Add new image
        const img = document.createElement('img');
        img.src = imageSrc;
        img.className = 'project-image lazy-image';
        imageContainer.insertBefore(img, imageContainer.firstChild);
        
        // Optimize image loading
        img.onload = () => {
            img.classList.add('loaded');
        };
    }
}

/**
 * Optimize images with lazy loading
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===========================
// Navigation Functions
// ===========================

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/**
 * Smooth scroll to sections
 */
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink() {
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===========================
// Animation Functions
// ===========================

/**
 * Intersection Observer for fade-in animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Stats counter animation
 */
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.innerText.replace('+', ''));
                let current = 0;
                const increment = target / 50;
                const duration = 2000;
                const stepTime = duration / 50;
                
                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        stat.innerText = Math.round(current) + '+';
                        setTimeout(updateCount, stepTime);
                    } else {
                        stat.innerText = target + '+';
                    }
                };
                
                updateCount();
                observer.unobserve(stat);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

// ===========================
// Form Functions
// ===========================

/**
 * Handle contact form submission
 */
function handleContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In production, replace with actual API call:
            // const response = await fetch('YOUR_API_ENDPOINT', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Oops! Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Show notification message
 */
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        background: type === 'success' ? 'var(--accent-primary)' : '#ff4444',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===========================
// Utility Functions
// ===========================

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add custom animation styles
 */
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===========================
// Initialize Everything
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Core initialization
    initPreloader();
    initThemeToggle();
    initBackToTop();
    
    // Navigation
    toggleMobileMenu();
    handleStickyNavbar();
    smoothScroll();
    updateActiveNavLink();
    
    // Animations
    animateStats();
    
    // File uploads
    initResumeUpload();
    initImageUpload();
    initDragAndDrop();
    initLazyLoading();
    
    // Forms
    handleContactForm();
    
    // Utilities
    addCustomStyles();
    
    // Performance optimization
    const debouncedScroll = debounce(() => {
        updateActiveNavLink();
    }, 100);
    
    window.addEventListener('scroll', debouncedScroll);
    
    console.log('✨ Portfolio website initialized with all features!');
});

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('ServiceWorker registered'))
            .catch(err => console.log('ServiceWorker failed'));
    });
}
