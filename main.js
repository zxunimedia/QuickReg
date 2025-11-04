// ===================================
// 快立登 QuickReg - 主要 JavaScript
// ===================================

// 初始化 AOS 動畫
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 100
});

// ===================================
// 導航列滾動效果
// ===================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ===================================
// 手機選單切換
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
  
  // 點擊選單項目後關閉手機選單
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = mobileMenuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
}

// ===================================
// 平滑滾動到錨點
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ===================================
// FAQ 手風琴效果
// ===================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // 關閉所有其他 FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // 如果當前項目未開啟，則開啟它
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// ===================================
// 數字動畫效果（當元素進入視窗）
// ===================================
function animateNumber(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = Math.floor(target).toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

// 觀察數字元素是否進入視窗
const observeNumbers = () => {
  const numberElements = document.querySelectorAll('[data-count]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        animateNumber(entry.target, target);
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });
  
  numberElements.forEach(el => observer.observe(el));
};

// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', observeNumbers);

// ===================================
// 表單驗證函數（共用）
// ===================================
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  // 台灣手機格式：09xxxxxxxx 或 區碼-電話
  const re = /^(09\d{8}|0\d{1,2}-?\d{6,8})$/;
  return re.test(phone.replace(/\s/g, ''));
}

function validateTaiwanID(id) {
  // 台灣身分證格式驗證
  const re = /^[A-Z][12]\d{8}$/;
  if (!re.test(id)) return false;
  
  const letters = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
  
  const idArray = id.split('');
  const letterNum = letters.indexOf(idArray[0]) + 10;
  const nums = [Math.floor(letterNum / 10), letterNum % 10, ...idArray.slice(1).map(Number)];
  
  const sum = nums.reduce((acc, num, idx) => acc + num * weights[idx], 0);
  return sum % 10 === 0;
}

// ===================================
// 顯示載入動畫
// ===================================
function showLoading() {
  const loader = document.createElement('div');
  loader.id = 'loading-overlay';
  loader.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.7); display: flex; align-items: center; 
                justify-content: center; z-index: 9999;">
      <div style="text-align: center; color: white;">
        <div style="border: 4px solid #f3f3f3; border-top: 4px solid #FE8113; 
                    border-radius: 50%; width: 50px; height: 50px; 
                    animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <p style="font-size: 1.2rem;">處理中...</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById('loading-overlay');
  if (loader) {
    loader.remove();
  }
}

// ===================================
// 顯示通知訊息
// ===================================
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; z-index: 10000; 
                padding: 1rem 2rem; background: ${type === 'success' ? '#10b981' : '#ef4444'}; 
                color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease;">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      ${message}
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===================================
// LocalStorage 輔助函數
// ===================================
function saveFormData(formId, data) {
  localStorage.setItem(`quickreg_${formId}`, JSON.stringify(data));
}

function loadFormData(formId) {
  const data = localStorage.getItem(`quickreg_${formId}`);
  return data ? JSON.parse(data) : null;
}

function clearFormData(formId) {
  localStorage.removeItem(`quickreg_${formId}`);
}

// ===================================
// 頁面離開前提醒（表單未完成）
// ===================================
let formChanged = false;

function setupFormChangeDetection() {
  const formInputs = document.querySelectorAll('form input, form select, form textarea');
  formInputs.forEach(input => {
    input.addEventListener('change', () => {
      formChanged = true;
    });
  });
  
  window.addEventListener('beforeunload', (e) => {
    if (formChanged) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
}

// 表單提交後清除標記
function formSubmitted() {
  formChanged = false;
}

// ===================================
// 初始化（根據頁面類型）
// ===================================
if (document.querySelector('form')) {
  setupFormChangeDetection();
}

console.log('快立登 QuickReg - 系統初始化完成 ✓');



// ===================================
// Enhanced Interactive Features
// ===================================

// Scroll Progress Bar
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// Magnetic Button Effect
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.glass-button, .btn-primary, .float-btn');
  
  magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}

// Parallax Effect for Hero Section
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = hero.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-parallax') || 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// Particle Background Effect
function createParticles(container, count = 20) {
  const particlesDiv = document.createElement('div');
  particlesDiv.className = 'particles';
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particlesDiv.appendChild(particle);
  }
  
  container.style.position = 'relative';
  container.appendChild(particlesDiv);
}

// Enhanced Card Interactions
function initCardInteractions() {
  const cards = document.querySelectorAll('.feature-card, .pricing-card, .process-step');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
    
    // 3D Tilt Effect
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

// Smooth Scroll Indicator
function initScrollIndicator() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.innerHTML = '<i class="fas fa-chevron-down" style="font-size: 2rem; color: white;"></i>';
  hero.appendChild(indicator);
  
  indicator.addEventListener('click', () => {
    const nextSection = hero.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Hide indicator after scrolling
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
      indicator.style.opacity = '0';
    } else {
      indicator.style.opacity = '1';
    }
  });
}

// Lazy Loading Images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.classList.add('lazy-load', 'loaded');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Typing Effect for Hero Title
function initTypingEffect() {
  const typingElements = document.querySelectorAll('[data-typing]');
  
  typingElements.forEach(element => {
    const text = element.getAttribute('data-typing');
    element.textContent = '';
    element.style.display = 'inline-block';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    
    // Start typing when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeWriter();
          observer.unobserve(element);
        }
      });
    });
    
    observer.observe(element);
  });
}

// Counter Animation Enhancement
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.getAttribute('data-counter'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += increment;
          if (current >= target) {
            entry.target.textContent = target.toLocaleString() + suffix;
          } else {
            entry.target.textContent = Math.floor(current).toLocaleString() + suffix;
            requestAnimationFrame(updateCounter);
          }
        };
        
        updateCounter();
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

// Button Ripple Effect
function initButtonRipple() {
  const buttons = document.querySelectorAll('.glass-button, .btn-primary');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: ripple-animation 0.6s ease-out;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation CSS
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Floating Animation for Feature Icons
function initFloatingIcons() {
  const icons = document.querySelectorAll('.feature-icon');
  
  icons.forEach((icon, index) => {
    icon.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
    icon.style.animationDelay = `${index * 0.2}s`;
  });
}

// Video Player Enhancement
function initVideoPlayer() {
  const videoContainers = document.querySelectorAll('.video-container');
  
  videoContainers.forEach(container => {
    const iframe = container.querySelector('iframe');
    if (!iframe) return;
    
    // Add play overlay
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';
    overlay.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                  background: rgba(0,0,0,0.3); display: flex; align-items: center; 
                  justify-content: center; cursor: pointer; transition: all 0.3s;">
        <i class="fas fa-play-circle" style="font-size: 5rem; color: white; opacity: 0.9;"></i>
      </div>
    `;
    
    overlay.addEventListener('click', function() {
      this.style.display = 'none';
      // Auto-play video (if supported)
      const src = iframe.src;
      iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
    });
    
    container.style.position = 'relative';
    container.appendChild(overlay);
  });
}

// Tooltip Enhancement
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function(e) {
      const tooltip = this.getAttribute('data-tooltip');
      const tooltipDiv = document.createElement('div');
      tooltipDiv.className = 'custom-tooltip';
      tooltipDiv.textContent = tooltip;
      tooltipDiv.style.cssText = `
        position: fixed;
        background: var(--secondary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        z-index: 10000;
        pointer-events: none;
        animation: fadeIn 0.2s;
      `;
      
      document.body.appendChild(tooltipDiv);
      
      const updatePosition = (e) => {
        tooltipDiv.style.left = e.clientX + 10 + 'px';
        tooltipDiv.style.top = e.clientY + 10 + 'px';
      };
      
      updatePosition(e);
      this.addEventListener('mousemove', updatePosition);
      
      this.addEventListener('mouseleave', function() {
        tooltipDiv.remove();
        this.removeEventListener('mousemove', updatePosition);
      }, { once: true });
    });
  });
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for page to fully load
  setTimeout(() => {
    initScrollProgress();
    initMagneticButtons();
    initParallax();
    initCardInteractions();
    initScrollIndicator();
    initLazyLoading();
    initCounterAnimation();
    initButtonRipple();
    initFloatingIcons();
    initTooltips();
    
    // Add particles to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      createParticles(hero, 15);
    }
    
    console.log('✨ Enhanced interactive features initialized!');
  }, 100);
});

// Performance optimization: Debounce scroll events
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

// Optimize scroll performance
const optimizedScroll = debounce(() => {
  // Your scroll handlers here
}, 10);

window.addEventListener('scroll', optimizedScroll);

