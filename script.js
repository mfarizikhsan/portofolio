/* ============================================
   PORTFOLIO — Alex Rayhan
   script.js
   ============================================ */

/* ---------- 1. Navbar: scroll effect + active link ---------- */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function handleNavScroll() {
  // Tambah class "scrolled" saat user scroll > 60px
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Tandai nav link aktif berdasarkan section yang terlihat
  let currentSection = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // jalankan saat load


/* ---------- 2. Hamburger menu ---------- */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Tutup menu saat nav link diklik
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// Tutup menu saat klik di luar
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }
});


/* ---------- 3. Smooth scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ---------- 4. Scroll reveal animation ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay berdasarkan urutan elemen dalam grup
      const siblings = entry.target.closest('.container')?.querySelectorAll('.reveal') || [];
      const index = Array.from(siblings).indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 0.08}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animasi hanya sekali
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ---------- 5. Skill bars animation ---------- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.skill-bar');
      bars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        // Sedikit delay agar animasi muncul setelah card terlihat
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);


/* ---------- 6. Back to top button ---------- */
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
// Sembunyikan nav menu di hero, muncul saat scroll
function handleNavVisibility() {
  const heroHeight = document.getElementById('home').offsetHeight;

  if (window.scrollY < heroHeight - 80) {
    // Di hero section — sembunyikan menu, tampilkan logo saja
    navMenu.style.opacity = '0';
    navMenu.style.pointerEvents = 'none';
  } else {
    // Sudah scroll — tampilkan menu kembali
    navMenu.style.opacity = '1';
    navMenu.style.pointerEvents = 'auto';
  }
}
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.querySelector('.theme-icon');

// Cek preferensi tersimpan
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

// Toggle saat diklik
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeIcon.textContent = next === 'dark' ? '🌙' : '☀️';
});

// Ikuti preferensi sistem otomatis
if (!localStorage.getItem('theme')) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '🌙';
  }
}

window.addEventListener('scroll', handleNavVisibility, { passive: true });
handleNavVisibility(); // jalankan saat load
/* ---------- 7. Form validation ---------- */
const contactForm = document.getElementById('contact-form');

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById('error-' + fieldId);
  if (field) field.classList.add('error');
  if (error) error.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById('error-' + fieldId);
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Clear error saat user mulai mengetik
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => clearError(id));
  }
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Clear semua error dulu
  ['name', 'email', 'message'].forEach(clearError);

  // Validasi Nama
  if (!name) {
    showError('name', 'Nama wajib diisi.');
    valid = false;
  } else if (name.length < 2) {
    showError('name', 'Nama minimal 2 karakter.');
    valid = false;
  }

  // Validasi Email
  if (!email) {
    showError('email', 'Email wajib diisi.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'Format email tidak valid.');
    valid = false;
  }

  // Validasi Pesan
  if (!message) {
    showError('message', 'Pesan wajib diisi.');
    valid = false;
  } else if (message.length < 10) {
    showError('message', 'Pesan minimal 10 karakter.');
    valid = false;
  }

  // Jika valid, tampilkan pesan sukses (simulasi)
  if (valid) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('form-success');

    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    // Simulasi pengiriman (dalam implementasi nyata, gunakan fetch/AJAX)
    setTimeout(() => {
      contactForm.reset();
      submitBtn.textContent = 'Kirim Pesan →';
      submitBtn.disabled = false;
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    }, 1200);
  }
});




/* ---------- 8. Parallax subtle pada hero decoration ---------- */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const c1 = document.querySelector('.c1');
  const c2 = document.querySelector('.c2');
  const bgText = document.querySelector('.hero-bg-text');

  if (c1) c1.style.transform = `translateY(${scrollY * 0.12}px)`;
  if (c2) c2.style.transform = `translateY(${scrollY * 0.08}px)`;
  if (bgText) bgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
}, { passive: true });
