/**
 * Enhanced Personal Portfolio Website
 * JavaScript functionality for Theodore Hu's portfolio
 * Author: Theodore Hu (胡云韬)
 * Optimized version with performance improvements
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

    // 检查元素是否在视口中
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // ==========================================
    // Preloader Management
    // ==========================================
    
    const initPreloader = () => {
        try {
            const preloader = document.querySelector('.preloader');
            if (!preloader) return;

            // 确保最小加载时间以获得更好的用户体验
            const minLoadTime = 2000;
            const startTime = Date.now();

            const hidePreloader = () => {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, minLoadTime - elapsedTime);
                
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    
                    // 动画完成后从DOM中移除
                    setTimeout(() => {
                        if (preloader.parentNode) {
                            preloader.parentNode.removeChild(preloader);
                        }
                        // 触发页面加载完成事件
                        document.body.classList.add('loaded');
                    }, 800);
                }, remainingTime);
            };

            // 页面完全加载后隐藏预加载器
            if (document.readyState === 'complete') {
                hidePreloader();
            } else {
                window.addEventListener('load', hidePreloader);
            }
        } catch (error) {
            console.error('Preloader initialization failed:', error);
            // 失败时立即移除预加载器
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

            // 移动端菜单切换
            if (navToggle && navLinks) {
                navToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navToggle.classList.toggle('active');
                    navLinks.classList.toggle('active');
                    document.body.classList.toggle('nav-open');
                });

                // 点击外部关闭移动端菜单
                document.addEventListener('click', (e) => {
                    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                        navToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    }
                });

                // ESC键关闭菜单
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                        navToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    }
                });
            }

            // 点击导航链接关闭移动端菜单
            navLinkElements.forEach(link => {
                link.addEventListener('click', () => {
                    if (navToggle && navLinks) {
                        navToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    }
                });
            });

            // 基于滚动的导航样式
            const handleNavScroll = throttle(() => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }, 100);

            window.addEventListener('scroll', handleNavScroll);

            // 活动导航高亮
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
            
            // 初始调用以设置正确的活动状态
            updateActiveNav();

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
                        const navHeight = document.querySelector('.main-nav')?.offsetHeight || 80;
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
                        
                        // 触发技能条动画
                        if (entry.target.classList.contains('skill-group')) {
                            setTimeout(() => {
                                animateSkillBars(entry.target);
                            }, 200);
                        }

                        // 为性能考虑，观察后停止观察
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // 观察淡入元素
            document.querySelectorAll('.fade-in').forEach(element => {
                observer.observe(element);
            });

            // 观察技能组
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
                const targetWidth = bar.getAttribute('data-width');
                
                if (targetWidth) {
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                        bar.classList.add('animated');
                    }, index * 150);
                }
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
                    
                    // 更新活动按钮
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 过滤画廊项目
                    galleryItems.forEach(item => {
                        const category = item.getAttribute('data-category');
                        
                        if (filter === 'all' || category === filter) {
                            item.classList.remove('hide');
                            item.style.display = 'block';
                        } else {
                            item.classList.add('hide');
                            // 动画完成后完全隐藏
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
    // Enhanced Lazy Loading
    // ==========================================
    
    const initLazyLoading = () => {
        try {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                // 创建新图片对象进行预加载
                                const newImg = new Image();
                                newImg.onload = () => {
                                    img.src = img.dataset.src;
                                    img.classList.add('loaded');
                                };
                                newImg.onerror = () => {
                                    img.classList.add('error');
                                    console.warn('Failed to load image:', img.dataset.src);
                                };
                                newImg.src = img.dataset.src;
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });

                document.querySelectorAll('.lazy-image').forEach(img => {
                    imageObserver.observe(img);
                });
            } else {
                // 降级处理：直接加载所有图片
                document.querySelectorAll('.lazy-image').forEach(img => {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    }
                });
            }
        } catch (error) {
            console.error('Lazy loading initialization failed:', error);
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

                // 验证表单
                if (!validateForm(this)) {
                    return;
                }

                // 显示加载状态
                submitButton.innerHTML = '<span>Sending...</span><i class="ri-loader-4-line"></i>';
                submitButton.disabled = true;
                this.classList.add('loading');

                try {
                    // 模拟表单提交（替换为实际的表单处理程序）
                    await simulateFormSubmission(formData);
                    
                    // 显示成功消息
                    showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                    
                    // 重置表单
                    this.reset();
                    
                } catch (error) {
                    // 显示错误消息
                    showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
                    console.error('Form submission error:', error);
                } finally {
                    // 恢复按钮状态
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    this.classList.remove('loading');
                }
            });

            // 实时表单验证
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });

            // 表单状态显示函数
            function showFormMessage(message, type) {
                if (formStatus) {
                    formStatus.textContent = message;
                    formStatus.className = `form-status ${type}`;
                    
                    // 5秒后清除消息
                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }, 5000);
                }
            }

        } catch (error) {
            console.error('Contact form initialization failed:', error);
        }
    };

    // 表单验证辅助函数
    const validateForm = (form) => {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });

        return isValid;
    };

    const validateField = (e) => {
        const field = e.target;
        const value = field.value.trim();
        
        // 移除现有错误样式
        clearFieldError(e);
        
        // 基于字段类型验证
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        if (field.name === 'name' && value && value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters long');
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
        
        // 移除现有错误消息
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // 添加新错误消息
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const simulateFormSubmission = (formData) => {
        return new Promise((resolve, reject) => {
            // 模拟API调用延迟
            setTimeout(() => {
                // 模拟90%成功率
                if (Math.random() > 0.1) {
                    resolve({
                        success: true,
                        message: 'Message sent successfully'
                    });
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
            let backToTopButton = document.getElementById('backToTop');
            
            if (!backToTopButton) {
                // 如果不存在则创建返回顶部按钮
                const button = document.createElement('button');
                button.id = 'backToTop';
                button.className = 'back-to-top';
                button.innerHTML = '<i class="ri-arrow-up-line"></i>';
                button.setAttribute('aria-label', 'Back to top');
                document.body.appendChild(button);
                backToTopButton = button;
            }

            // 基于滚动位置显示/隐藏按钮
            const toggleBackToTop = throttle(() => {
                if (window.scrollY > 300) {
                    backToTopButton.classList.add('show');
                } else {
                    backToTopButton.classList.remove('show');
                }
            }, 100);

            window.addEventListener('scroll', toggleBackToTop);

            // 点击时滚动到顶部
            backToTopButton.addEventListener('click', () => {
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
    // Theme Toggle (Dark Mode)
    // ==========================================
    
    const initThemeToggle = () => {
        try {
            // 从localStorage获取保存的主题
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.setAttribute('data-theme', savedTheme);
            
            // 更新切换按钮图标
            const toggle = document.querySelector('.theme-toggle');
            if (toggle) {
                toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
            }
        } catch (error) {
            console.error('Theme toggle initialization failed:', error);
        }
    };

    // 主题切换函数（全局）
    window.toggleTheme = function() {
        try {
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            
            // 保存到本地存储
            localStorage.setItem('theme', newTheme);
            
            // 更新按钮图标
            const toggle = document.querySelector('.theme-toggle');
            if (toggle) {
                toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            }

            // 触发自定义事件
            document.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme: newTheme }
            }));

        } catch (error) {
            console.error('Theme toggle failed:', error);
        }
    };

    // ==========================================
    // Performance Monitoring
    // ==========================================
    
    const initPerformanceMonitoring = () => {
        try {
            // 监控页面加载性能
            window.addEventListener('load', () => {
                if ('performance' in window) {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
                        console.log(`Page loaded in ${loadTime}ms`);
                        
                        // 如果加载时间过长，可以在这里添加优化提示
                        if (loadTime > 3000) {
                            console.warn('Page load time is over 3 seconds. Consider optimization.');
                        }
                    }
                }
            });

            // 监控内存使用（如果支持）
            if ('memory' in performance) {
                const logMemoryUsage = () => {
                    const memory = performance.memory;
                    console.log('Memory usage:', {
                        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
                    });
                };
                
                // 每30秒记录一次内存使用
                setInterval(logMemoryUsage, 30000);
            }

        } catch (error) {
            console.error('Performance monitoring initialization failed:', error);
        }
    };

    // ==========================================
    // Error Handling & Fallbacks
    // ==========================================
    
    const initErrorHandling = () => {
        // 全局错误处理
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            // 这里可以发送错误报告到分析服务
        });

        // 未处理的Promise拒绝处理
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });

        // 图片加载错误处理
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn('Image failed to load:', e.target.src);
                e.target.classList.add('image-error');
                // 可以设置一个默认图片
                // e.target.src = 'path/to/default-image.jpg';
            }
        }, true);
    };

    // ==========================================
    // Keyboard Navigation
    // ==========================================
    
    const initKeyboardNavigation = () => {
        try {
            // Tab键导航增强
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });

            // 快捷键支持
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + K 打开搜索（如果有的话）
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    // 这里可以添加搜索功能
                }

                // 按 '/' 键聚焦到搜索框（如果有的话）
                if (e.key === '/' && !e.target.matches('input, textarea')) {
                    e.preventDefault();
                    // 这里可以聚焦到搜索框
                }
            });

        } catch (error) {
            console.error('Keyboard navigation initialization failed:', error);
        }
    };

    // ==========================================
    // Initialize All Components
    // ==========================================
    
    const initializeApp = () => {
        try {
            console.log('Initializing Theodore Hu Portfolio Website...');
            
            // 核心功能
            initPreloader();
            initNavigation();
            initSmoothScrolling();
            initScrollAnimations();
            
            // 交互功能
            initGalleryFilter();
            initContactForm();
            initBackToTop();
            initThemeToggle();
            
            // 性能功能
            initLazyLoading();
            initPerformanceMonitoring();
            
            // 辅助功能
            initErrorHandling();
            initKeyboardNavigation();
            
            console.log('Portfolio website initialized successfully!');
            
            // 触发初始化完成事件
            document.dispatchEvent(new CustomEvent('portfolioInitialized'));
            
        } catch (error) {
            console.error('Failed to initialize portfolio website:', error);
        }
    };

    // ==========================================
    // Start Application
    // ==========================================
    
    // 初始化应用程序
    initializeApp();

    // 页面可见性变化时重新初始化（类似SPA行为）
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // 页面变为可见时刷新动画
            initScrollAnimations();
        }
    });

    // 处理窗口大小变化
    window.addEventListener('resize', debounce(() => {
        // 重新计算任何依赖大小的功能
        const nav = document.querySelector('.main-nav');
        if (nav && window.innerWidth > 768) {
            // 桌面端调整大小时关闭移动端菜单
            const navToggle = document.querySelector('.nav-toggle');
            const navLinks = document.querySelector('.nav-links');
            if (navToggle && navLinks) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        }
    }, 250));

    // 处理在线/离线状态
    window.addEventListener('online', () => {
        console.log('Connection restored');
        document.body.classList.remove('offline');
    });

    window.addEventListener('offline', () => {
        console.log('Connection lost');
        document.body.classList.add('offline');
    });

});

// ==========================================
// Additional Utility Functions (Global Scope)
// ==========================================

// 实用函数：检查元素是否在视口中
window.isInViewport = function(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// 实用函数：平滑显示元素动画
window.revealElement = function(element, delay = 0) {
    setTimeout(() => {
        if (element) {
            element.classList.add('active');
        }
    }, delay);
};

// 实用函数：获取设备信息
window.getDeviceInfo = function() {
    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTablet: /iPad|Android|Tablet/i.test(navigator.userAgent),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        supportsTouch: 'ontouchstart' in window,
        supportsWebP: function() {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }()
    };
};

// 实用函数：cookie操作
window.cookieUtils = {
    set: function(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    get: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    delete: function(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

// 导出模块（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isInViewport: window.isInViewport,
        revealElement: window.revealElement,
        getDeviceInfo: window.getDeviceInfo,
        cookieUtils: window.cookieUtils,
        toggleTheme: window.toggleTheme
    };
}

// 添加一些有用的原型方法
String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

// 防抖函数原型
Function.prototype.debounce = function(wait) {
    const fn = this;
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
    };
};

// 节流函数原型
Function.prototype.throttle = function(limit) {
    const fn = this;
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// 页面加载完成后的最终处理
window.addEventListener('load', function() {
    // 移除加载类
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // 初始化所有延迟加载的功能
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // 发送页面加载完成的自定义事件
    window.dispatchEvent(new CustomEvent('pageFullyLoaded'));
});

// 添加页面离开前的清理
window.addEventListener('beforeunload', function() {
    // 清理定时器和监听器
    document.body.classList.add('unloading');
});

// PWA支持（如果需要的话）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// 最终的性能优化
document.addEventListener('DOMContentLoaded', function() {
    // 预连接到外部资源
    const preconnectLinks = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://images.unsplash.com'
    ];
    
    preconnectLinks.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        document.head.appendChild(link);
    });
});

// Console信息
console.log('%c🚀 Theodore Hu Portfolio Website', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
console.log('%c✨ Optimized for performance and accessibility', 'color: #10b981; font-size: 12px;');
console.log('%c📧 Contact: HuYunt1999@163.com', 'color: #6b7280; font-size: 12px;');
