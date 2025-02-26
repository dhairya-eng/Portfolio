// script.js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// Add scroll animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if(entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
      }
  });
});

document.querySelectorAll('.timeline-item').forEach((el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.5s ease-out';
  observer.observe(el);
});
