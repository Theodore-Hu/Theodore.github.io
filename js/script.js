// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Remove preloader once page is loaded
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }, 2500);

    // Navigation toggle for mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close navigation when a link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Add 'scrolled' class to navigation on scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.main-nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Active navigation item based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
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

    // Fade-in animation on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('active');
            }
        });
    }
    
    // Check fade on load
    checkFade();
    
    // Check fade on scroll
    window.addEventListener('scroll', checkFade);

    // Initialize skill progress bars with animation
    const skillProgress = document.querySelectorAll('.skill-progress');
    
    function animateSkills() {
        skillProgress.forEach(progress => {
            const width = progress.style.width;
            progress.style.width = '0';
            
            setTimeout(() => {
                progress.style.width = width;
            }, 300);
        });
    }
    
    // Set initial width values for skill bars
    function initSkillBars() {
        if (document.querySelector('#skills')) {
            const skillsSection = document.querySelector('#skills');
            const sectionTop = skillsSection.offsetTop;
            const sectionHeight = skillsSection.clientHeight;
            
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > sectionTop - window.innerHeight + 200 &&
                    window.pageYOffset < sectionTop + sectionHeight) {
                    animateSkills();
                    // Remove this event listener after animation is triggered
                    window.removeEventListener('scroll', arguments.callee);
                }
            });
        }
    }
    
    initSkillBars();

    // Gallery filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to current button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // Form submission handler
    const contactForm = document.querySelector('#contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.querySelector('#name').value;
            const email = document.querySelector('#email').value;
            const message = document.querySelector('#message').value;
            
            // Here you would normally send the form data to a server
            // For this example, we'll just log it to the console
            console.log('Form submitted:', { name, email, message });
            
            // Show success message (you can customize this)
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset the form
            contactForm.reset();
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroBg) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrollPosition <= heroHeight) {
                heroBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            }
        });
    }

    // Animate counter (if you add counters to the page)
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // milliseconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(function() {
            current += step;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Initialize animations
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const counterSection = counters[0].closest('section');
        const sectionTop = counterSection.offsetTop;
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > sectionTop - window.innerHeight + 200) {
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                
                // Remove this event listener after animation is triggered
                window.removeEventListener('scroll', arguments.callee);
            }
        });
    }

    // Typing animation for hero subtitle (optional effect)
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroSubtitle && false) { // Disabled by default, set to true to enable
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(function() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }

    // Add image compare functionality if needed
    function initImageCompare() {
        const compareElements = document.querySelectorAll('.image-compare');
        
        compareElements.forEach(element => {
            const handle = element.querySelector('.compare-handle');
            const before = element.querySelector('.before');
            
            element.addEventListener('mousemove', function(e) {
                const position = (e.clientX - element.getBoundingClientRect().left) / element.offsetWidth;
                before.style.width = position * 100 + '%';
                handle.style.left = position * 100 + '%';
            });
        });
    }
    
    if (document.querySelector('.image-compare')) {
        initImageCompare();
    }

    // Initialize light gallery or image viewer if needed
    function initLightbox() {
        const galleryImages = document.querySelectorAll('.gallery-item');
        
        galleryImages.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const caption = this.querySelector('.gallery-info h3').textContent;
                
                // Create light box elements
                const lightbox = document.createElement('div');
                lightbox.classList.add('lightbox');
                
                const lightboxContent = document.createElement('div');
                lightboxContent.classList.add('lightbox-content');
                
                const img = document.createElement('img');
                img.setAttribute('src', imgSrc);
                
                const captionElement = document.createElement('p');
                captionElement.textContent = caption;
                
                const closeBtn = document.createElement('span');
                closeBtn.classList.add('lightbox-close');
                closeBtn.innerHTML = '&times;';
                
                lightboxContent.appendChild(img);
                lightboxContent.appendChild(captionElement);
                lightbox.appendChild(closeBtn);
                lightbox.appendChild(lightboxContent);
                
                document.body.appendChild(lightbox);
                
                // Add close functionality
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(lightbox);
                });
                
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox) {
                        document.body.removeChild(lightbox);
                    }
                });
            });
        });
    }
    
    // Uncomment to enable lightbox functionality
    // initLightbox();
});
