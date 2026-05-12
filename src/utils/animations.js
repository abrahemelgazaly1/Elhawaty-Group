// Animation utilities for scroll-triggered animations

export const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Add stagger delay for multiple elements
        const siblings = entry.target.parentElement?.children;
        if (siblings) {
          Array.from(siblings).forEach((sibling, index) => {
            if (sibling.classList.contains('animate-on-scroll')) {
              setTimeout(() => {
                sibling.classList.add('visible');
              }, index * 100);
            }
          });
        }
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll('.animate-on-scroll, .section-animation');
  animatedElements.forEach((el) => observer.observe(el));

  return observer;
};

export const addStaggerDelay = (elements, baseDelay = 0) => {
  elements.forEach((element, index) => {
    element.style.setProperty('--delay', `${baseDelay + (index * 0.1)}s`);
    element.style.animationDelay = `${baseDelay + (index * 0.1)}s`;
  });
};

export const animateCounter = (element, target, duration = 2000) => {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    element.textContent = Math.floor(start).toLocaleString();
    
    if (start >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    }
  }, 16);
};

export const createFloatingElements = (container, count = 5) => {
  for (let i = 0; i < count; i++) {
    const element = document.createElement('div');
    element.className = 'absolute bg-beige bg-opacity-10 rounded-full float-element';
    
    const size = Math.random() * 60 + 20;
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.left = `${Math.random() * 100}%`;
    element.style.top = `${Math.random() * 100}%`;
    element.style.animationDelay = `${Math.random() * 3}s`;
    element.style.animationDuration = `${3 + Math.random() * 2}s`;
    
    container.appendChild(element);
  }
};