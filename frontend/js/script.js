// Portfolio interactions
AOS.init({ duration: 800, once: true, offset: 120 });

const loadingScreen = document.getElementById('loadingScreen');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const progressBar = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const typingText = document.querySelector('.typing-text');
const words = ['MERN Developer', 'Frontend Developer', 'AI Developer', 'Problem Solver'];

window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 900);
});

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');

function updateThemeIcon() {
  const icon = themeToggle.querySelector('i');
  icon.className = document.body.classList.contains('dark') ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

updateThemeIcon();

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('portfolio-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeIcon();
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

const sections = document.querySelectorAll('main section');
const navItems = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((item) => {
          item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => observer.observe(section));

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / height) * 100;
  progressBar.style.width = `${progress}%`;
  backToTop.classList.toggle('show', scrollTop > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

document.querySelectorAll('a, button, .project-card, .skill-group, .cert-card, .stat-card').forEach((element) => {
  element.addEventListener('mouseenter', () => {
    cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.4)';
  });
  element.addEventListener('mouseleave', () => {
    cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

function typeLoop() {
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = words[wordIndex];
    typingText.textContent = current.slice(0, charIndex);

    if (!isDeleting && charIndex < current.length) {
      charIndex += 1;
    } else if (isDeleting && charIndex > 0) {
      charIndex -= 1;
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
    }

    const speed = isDeleting ? 60 : 100;
    setTimeout(tick, speed);
  }

  tick();
}

typeLoop();

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number(entry.target.dataset.target);
        const suffix = entry.target.textContent.includes('%') ? '%' : '';
        const duration = 1400;
        const startTime = performance.now();

        function updateCounter(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const value = target * progress;
          entry.target.textContent = Number.isInteger(target) ? Math.floor(value).toString() : value.toFixed(2);
          if (progress < 1) requestAnimationFrame(updateCounter);
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.7 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const progressBars = document.querySelectorAll('.progress > div');
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.width || entry.target.getAttribute('style');
        entry.target.style.width = entry.target.getAttribute('style').match(/width:\s*([0-9.]+%)/)?.[1] || '0%';
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

progressBars.forEach((bar) => skillObserver.observe(bar));

document.querySelector('.contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Thanks for your message! I will get back to you soon.');
  event.target.reset();
});
