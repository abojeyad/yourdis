// تأثير التفاعل على الشعار فقط
document.addEventListener('DOMContentLoaded', function() {
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.05)';
      this.style.filter = 'drop-shadow(0 0 20px rgba(241, 143, 1, 0.5))';
    });
    
    logo.addEventListener('mouseout', function() {
      this.style.transform = 'scale(1)';
      this.style.filter = 'drop-shadow(0 0 15px rgba(241, 143, 1, 0.3))';
    });
  }

  // إنشاء جزيئات إضافية بدون حركة ديناميكية
  const particlesContainer = document.querySelector('.bg-particles');
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.top = Math.random() * 100 + '%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = Math.random() * 5 + 3 + 'px';
    particle.style.height = particle.style.width;
    const colors = [
      'rgba(241, 143, 1, 0.2)',
      'rgba(255, 165, 0, 0.2)',
      'rgba(107, 15, 26, 0.15)',
      'rgba(210, 105, 30, 0.15)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particlesContainer.appendChild(particle);
  }
});
