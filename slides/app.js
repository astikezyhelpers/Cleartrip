// Enhanced Chart.js defaults for better appearance
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = 'Inter, sans-serif';
  Chart.defaults.color = '#1A1A1A';
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  Chart.defaults.plugins.tooltip.titleColor = '#E64A19';
  Chart.defaults.plugins.tooltip.bodyColor = '#1A1A1A';
  Chart.defaults.plugins.tooltip.borderColor = '#E64A19';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
}

// Load VanillaTilt for subtle 3D hover effects
function loadVanillaTilt() {
  if (window.VanillaTilt) {
    initializeTilt();
    return;
  }
  
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/vanilla-tilt@1.7.2/dist/vanilla-tilt.min.js';
  script.onload = initializeTilt;
  document.head.appendChild(script);
}

function initializeTilt() {
  // Only apply tilt on larger screens for better mobile experience
  if (window.innerWidth > 768) {
    VanillaTilt.init(document.querySelectorAll('.content-card, .stat-card, .feature-card'), {
      max: 3, // Very subtle effect
      speed: 400,
      glare: true,
      'max-glare': 0.05, // Minimal glare
      scale: 1.005, // Very subtle scale
      perspective: 1000
    });
  }
}

// Enhanced chart zoom plugin loader
function loadChartZoomPlugin() {
  if (window.Chart && Chart.registeredZoom) return;
  
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.min.js';
  script.onload = () => {
    if (window.Chart) {
      Chart.register(window.chartjsPluginZoom);
      Chart.registeredZoom = true;
      
      // Apply zoom to all existing charts
      Chart.instances.forEach(chart => {
        chart.options.plugins.zoom = {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'xy'
          },
          pan: {
            enabled: true,
            mode: 'xy'
          }
        };
        chart.update();
      });
    }
  };
  document.head.appendChild(script);
}

// Intersection Observer for progressive animations
function initializeAnimationObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations for better visual effect
        setTimeout(() => {
          entry.target.classList.add('animate-in');
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  document.querySelectorAll('.stat-card, .feature-card, li').forEach(el => {
    el.style.transform = 'translateY(20px)';
    el.style.opacity = '0';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
}

// Keyboard navigation with better UX
function initializeKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Prevent navigation when user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      const nextBtn = document.querySelector('.nav-btn[href*="slide"]:last-child');
      if (nextBtn) {
        nextBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          nextBtn.style.transform = '';
          nextBtn.click();
        }, 150);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevBtn = document.querySelector('.nav-btn[href*="slide"]:first-child');
      if (prevBtn) {
        prevBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          prevBtn.style.transform = '';
          prevBtn.click();
        }, 150);
      }
    }
  });
}

// Progress bar animation with better timing
function animateProgressBar() {
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    const targetWidth = progressFill.style.width;
    progressFill.style.width = '0%';
    progressFill.style.transition = 'none';
    
    // Force reflow
    progressFill.offsetHeight;
    
    progressFill.style.transition = 'width 1s cubic-bezier(0.4, 0.0, 0.2, 1)';
    setTimeout(() => {
      progressFill.style.width = targetWidth;
    }, 300);
  }
}

// Enhanced stats counter animation with easing
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach((counter, index) => {
    const target = counter.textContent;
    const numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
    
    if (!isNaN(numericValue) && numericValue > 0) {
      // Stagger counter animations
      setTimeout(() => {
        let current = 0;
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();
        
        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease out cubic for smooth deceleration
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          current = numericValue * easeProgress;
          
          const prefix = target.match(/^[^\d]*/)[0];
          const suffix = target.match(/[^\d]*$/)[0];
          
          if (progress < 1) {
            counter.textContent = prefix + Math.floor(current) + suffix;
            requestAnimationFrame(animate);
          } else {
            counter.textContent = target;
          }
        };
        
        requestAnimationFrame(animate);
      }, index * 200);
    }
  });
}

// Handle responsive chart resizing
function handleChartResize() {
  if (window.Chart && Chart.instances.length > 0) {
    Chart.instances.forEach(chart => {
      chart.resize();
    });
  }
}

// Debounced resize handler
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

// Handle window resize for charts and tilt effects
const handleResize = debounce(() => {
  handleChartResize();
  
  // Reinitialize tilt on resize to handle mobile/desktop switches
  if (window.VanillaTilt) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      if (el.vanillaTilt) {
        el.vanillaTilt.destroy();
      }
    });
    setTimeout(initializeTilt, 100);
  }
}, 250);

// Smooth page transitions
function initializePageTransitions() {
  // Add loading state for better UX
  document.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.3s ease';
  });
}

// Add focus management for better accessibility
function initializeFocusManagement() {
  // Trap focus within navigation when using keyboard
  const navBtns = document.querySelectorAll('.nav-btn');
  if (navBtns.length > 0) {
    navBtns.forEach(btn => {
      btn.addEventListener('focus', () => {
        btn.style.outline = '2px solid #E64A19';
        btn.style.outlineOffset = '2px';
      });
      
      btn.addEventListener('blur', () => {
        btn.style.outline = '';
        btn.style.outlineOffset = '';
      });
    });
  }
}

// Enhanced performance monitoring
function initializePerformanceOptimizations() {
  // Lazy load images if any
  const images = document.querySelectorAll('img[data-src]');
  if (images.length > 0 && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // Optimize animations for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
  }
}

// Main initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
  try {
    loadVanillaTilt();
    loadChartZoomPlugin();
    initializeAnimationObserver();
    initializeKeyboardNavigation();
    initializePageTransitions();
    initializeFocusManagement();
    initializePerformanceOptimizations();
    
    // Stagger initial animations
    setTimeout(animateProgressBar, 200);
    setTimeout(animateCounters, 500);
    
  } catch (error) {
    console.warn('Some features may not be available:', error);
  }
});

// Event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
  setTimeout(handleResize, 100);
});

// Handle visibility change for better performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
    document.documentElement.style.setProperty('--animation-play-state', 'paused');
  } else {
    document.documentElement.style.setProperty('--animation-play-state', 'running');
  }
}); 