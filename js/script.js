/**
 * Enhanced Personal Portfolio Website
 * JavaScript functionality for Theodore Hu's portfolio
 * Author: Theodore Hu (胡云韬)
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==========================================
    // Utility Functions
    // ==========================================
    
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ==========================================
    // Preloader Management
    // ==========================================
    
    const initPreloader = () => {
        try {
            const preloader = document.querySelector('.preloader');
            if (!preloader) return;

            // Ensure minimum loading time for better UX
            const minLoadTime = 2000;
            const startTime = Date.now();

            const hidePreloader = () => {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, minLoadTime - elapsedTime);

                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    
                    // Remove from DOM after animation
                    setTimeout(() => {
                        if (preloader.parentNode) {
                            preloader.parentNode.removeChild(preloader);
                        }
                    }, 800);
                }, remainingTime);
            };

            // Hide preloader when page is fully loaded
            if (document.readyState === 'complete') {
                hidePreloader();
            } else {
                window.addEventListener('load', hidePreloader);
            }

        } catch (error) {
            console.error('Preloader initialization failed:', error);
            // Fallback: remove preloader immediately
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.style.display = 'none';
            }
        }
    };

    // ==========================================
    // Navigation Management
    // ==========================================
    
    const initNavigation = () => {
        try {
            const nav = document.querySelector('.main-nav');
            const navToggle = document.querySelector('.nav-toggle');
            const navLinks = document.querySelector('.nav-links');
            const navLinkElements = document.querySelectorAll('.nav-link');

            if (!nav) return;

            // Mobile menu toggle
            if (navToggle && navLinks) {
                navToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    navToggle.classList.toggle('active');
                    navLinks.classList.toggle('active');
                    document.body.classList.toggle('nav-open');
                });

                // Close mobile menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                        navToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    }
                });
            }

            // Close mobile menu when clicking on nav links
            navLinkElements.forEach(link => {
                link.addEventListener('click', () => {
                    if (navToggle && navLinks) {
                        navToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    }
                });
            });

            // Scroll-based navigation styling
            const handleNavScroll = throttle(() => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }, 100);

            window.addEventListener('scroll', handleNavScroll);

            // Active navigation highlighting
            const updateActiveNav = throttle(() => {
                const sections = document.querySelectorAll('section[id]');
                const scrollPosition = window.scrollY + 100;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLinkElements.forEach(link => link.classList.remove('active'));
                        if (navLink) {
                            navLink.classList.add('active');
                        }
                    }
                });
            }, 100);

            window.addEventListener('scroll', updateActiveNav);

        } catch (error) {
            console.error('Navigation initialization failed:', error);
        }
    };

    // ==========================================
    // Smooth Scrolling
    // ==========================================
    
    const initSmoothScrolling = () => {
        try {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    if (href === "#" || href === "#top") {
                        e.preventDefault();
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        return;
                    }

                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
                        const targetPosition = target.offsetTop - navHeight - 20;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Smooth scrolling initialization failed:', error);
        }
    };

    // ==========================================
    // Intersection Observer for Animations
    // ==========================================
    
    const initScrollAnimations = () => {
        try {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        
                        // Trigger skill bar animations
                        if (entry.target.classList.contains('skill-group')) {
                            animateSkillBars(entry.target);
                        }
                    }
                });
            }, observerOptions);

            // Observe fade-in elements
            document.querySelectorAll('.fade-in').forEach(element => {
                observer.observe(element);
            });

            // Observe skill groups
            document.querySelectorAll('.skill-group').forEach(element => {
                observer.observe(element);
            });

        } catch (error) {
            console.error('Scroll animations initialization failed:', error);
        }
    };

    // ==========================================
    // Skills Bar Animation
    // ==========================================
    
    const animateSkillBars = (skillGroup) => {
        try {
            const skillBars = skillGroup.querySelectorAll('.skill-progress');
            
            skillBars.forEach((bar, index) => {
                const targetWidth = bar.getAttribute('data-width') || bar.style.width;
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, index * 200);
            });
        } catch (error) {
            console.error('Skill bars animation failed:', error);
        }
    };

    // ==========================================
    // Gallery Filter System
    // ==========================================
    
    const initGalleryFilter = () => {
        try {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const galleryItems = document.querySelectorAll('.gallery-item');

            if (filterButtons.length === 0 || galleryItems.length === 0) return;

            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filter gallery items
                    galleryItems.forEach(item => {
                        const category = item.getAttribute('data-category');
                        
                        if (filter === 'all' || category === filter) {
                            item.classList.remove('hide');
                            item.style.display = 'block';
                        } else {
                            item.classList.add('hide');
                            // Hide completely after animation
                            setTimeout(() => {
                                if (item.classList.contains('hide')) {
                                    item.style.display = 'none';
                                }
                            }, 600);
                        }
                    });
                });
            });
        } catch (error) {
            console.error('Gallery filter initialization failed:', error);
        }
    };

    // ==========================================
    // Contact Form Enhancement
    // ==========================================
    
    const initContactForm = () => {
        try {
            const contactForm = document.getElementById('contactForm');
            const formStatus = document.querySelector('.form-status');

            if (!contactForm) return;

            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const submitButton = this.querySelector('.btn-submit');
                const originalText = submitButton.innerHTML;

                // Show loading state
                submitButton.innerHTML = '<span>Sending...</span><i class="ri-loader-4-line"></i>';
                submitButton.disabled = true;
                this.classList.add('loading');

                try {
                    // Simulate form submission (replace with actual form handler)
                    await simulateFormSubmission(formData);
                    
                    // Show success message
                    if (formStatus) {
                        formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                        formStatus.className = 'form-status success';
                    }
                    
                    // Reset form
                    this.reset();
                    
                } catch (error) {
                    // Show error message
                    if (formStatus) {
                        formStatus.textContent = 'Sorry, there was an error sending your message. Please try again.';
                        formStatus.className = 'form-status error';
                    }
                } finally {
                    // Restore button state
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    this.classList.remove('loading');
                    
                    // Clear status message after 5 seconds
                    setTimeout(() => {
                        if (formStatus) {
                            formStatus.textContent = '';
                            formStatus.className = 'form-status';
                        }
                    }, 5000);
                }
            });

            // Real-time form validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });

        } catch (error) {
            console.error('Contact form initialization failed:', error);
        }
    };

    // Form validation helper functions
    const validateField = (e) => {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error styling
        field.classList.remove('error');
        
        // Validate based on field type
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    };

    const clearFieldError = (e) => {
        const field = e.target;
        field.classList.remove('error');
        const errorMsg = field.parentNode.querySelector('.field-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    };

    const showFieldError = (field, message) => {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--color-danger)';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        errorElement.style.display = 'block';
        
        field.parentNode.appendChild(errorElement);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const simulateFormSubmission = (formData) => {
        return new Promise((resolve, reject) => {
            // Simulate API call delay
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
    };

    // ==========================================
    // Back to Top Button
    // ==========================================
    
    const initBackToTop = () => {
        try {
            const backToTopButton = document.getElementById('backToTop');
            
            if (!backToTopButton) {
                // Create back to top button if it doesn't exist
                const button = document.createElement('button');
                button.id = 'backToTop';
                button.className = 'back-to-top';
                button.innerHTML = '<i class="ri-arrow-up-line"></i>';
                button.setAttribute('aria-label', 'Back to top');
                document.body.appendChild(button);
            }

            const button = document.getElementById('backToTop');

            // Show/hide button based on scroll position
            const toggleBackToTop = throttle(() => {
                if (window.scrollY > 300) {
                    button.classList.add('show');
                } else {
                    button.classList.remove('show');
                }
            }, 100);

            window.addEventListener('scroll', toggleBackToTop);

            // Scroll to top when clicked
            button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

        } catch (error) {
            console.error('Back to top button initialization failed:', error);
        }
    };

    // ==========================================
    // Lazy Loading for Images
    // ==========================================
    
    const initLazyLoading = () => {
        try {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src || img.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        } catch (error) {
            console.error('Lazy loading initialization failed:', error);
        }
    };

    // ==========================================
    // Performance Monitoring
    // ==========================================
    
    const initPerformanceMonitoring = () => {
        try {
            // Monitor page load performance
            window.addEventListener('load', () => {
                if ('performance' in window) {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
                    }
                }
            });

            // Monitor Core Web Vitals (if supported)
            if ('web-vitals' in window) {
                // This would require the web-vitals library
                // import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';
            }
        } catch (error) {
            console.error('Performance monitoring initialization failed:', error);
        }
    };

    // ==========================================
    // Error Handling & Fallbacks
    // ==========================================
    
    const initErrorHandling = () => {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            // Could send error reports to analytics service
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    };

    // ==========================================
    // Initialize All Components
    // ==========================================
    
    const initializeApp = () => {
        try {
            console.log('Initializing Theodore Hu Portfolio Website...');
            
            // Core functionality
            initPreloader();
            initNavigation();
            initSmoothScrolling();
            initScrollAnimations();
            
            // Interactive features
            initGalleryFilter();
            initContactForm();
            initBackToTop();
            
            // Performance features
            initLazyLoading();
            initPerformanceMonitoring();
            
            // Error handling
            initErrorHandling();
            
            console.log('Portfolio website initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize portfolio website:', error);
        }
    };

    // ==========================================
    // Start Application
    // ==========================================
    
    // Initialize the application
    initializeApp();

    // Re-initialize on page visibility change (for SPA-like behavior)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Refresh animations when page becomes visible
            initScrollAnimations();
        }
    });

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        // Recalculate any size-dependent features
        const nav = document.querySelector('.main-nav');
        if (nav && window.innerWidth > 768) {
            // Close mobile menu on desktop resize
            const navToggle = document.querySelector('.nav-toggle');
            const navLinks = document.querySelector('.nav-links');
            if (navToggle && navLinks) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        }
    }, 250));

});

// ==========================================
// Additional Utility Functions (Global Scope)
// ==========================================

// Utility function to check if element is in viewport
window.isInViewport = function(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Utility function for smooth reveal animations
window.revealElement = function(element, delay = 0) {
    setTimeout(() => {
        if (element) {
            element.classList.add('active');
        }
    }, delay);
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isInViewport: window.isInViewport,
        revealElement: window.revealElement
    };
}
