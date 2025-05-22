document.addEventListener('DOMContentLoaded', function() {
    // 立即移除预加载器，确保内容可见
    try {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(function() {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 1000); // 减少等待时间
        }
    } catch (e) {
        console.error('预加载器移除失败:', e);
    }

    // 基本导航功能
    try {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
        }
    } catch (e) {
        console.error('导航功能初始化失败:', e);
    }

    // 简化的滚动效果
    try {
        window.addEventListener('scroll', function() {
            const nav = document.querySelector('.main-nav');
            if (nav) {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        });
    } catch (e) {
        console.error('滚动效果初始化失败:', e);
    }

    // 简化的淡入效果
    try {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        if (fadeElements.length > 0) {
            function checkFade() {
                fadeElements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    if (elementTop < window.innerHeight - 100) {
                        element.classList.add('active');
                    }
                });
            }
            
            // 初始检查
            checkFade();
            
            // 滚动时检查
            window.addEventListener('scroll', checkFade);
        }
    } catch (e) {
        console.error('淡入效果初始化失败:', e);
    }

    // 平滑滚动
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== "#") {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    } catch (e) {
        console.error('平滑滚动初始化失败:', e);
    }
});
