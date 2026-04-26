/* ================================================================
   script.js — SMK IT NURUL HIDAYAH PALALANGON
   Fungsi: Interaktivitas, Validasi Form, Animasi, Dark Mode, dsb.
   ================================================================ */

/* ----------------------------------------------------------------
   INISIALISASI — Jalankan setelah DOM selesai dimuat
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initTheme();
  initNavbar();
  initModals();
  initLoginForm();
  initContactForm();
  initCounterAnimation();
  initGalleryFilter();
  initBackToTop();
  initFooterYear();
  initNavHighlight();
});


/* ----------------------------------------------------------------
   1. INISIALISASI AOS (Animate On Scroll)
   ---------------------------------------------------------------- */
function initAOS() {
  AOS.init({
    duration: 700,         // Durasi animasi (ms)
    once: true,            // Animasi hanya diputar sekali
    offset: 60,            // Jarak dari bawah viewport sebelum trigger
    easing: 'ease-out-cubic',
  });
}


/* ----------------------------------------------------------------
   2. TEMA TERANG / GELAP (Dark Mode)
   ---------------------------------------------------------------- */
function initTheme() {
  const toggle    = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html      = document.documentElement;

  // Ambil preferensi yang tersimpan di localStorage, atau ikuti preferensi sistem
  const saved     = localStorage.getItem('smk-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  // Klik tombol toggle untuk berpindah tema
  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /**
   * Terapkan tema dan perbarui ikon tombol
   * @param {string} theme - 'light' atau 'dark'
   */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('smk-theme', theme);

    // Ganti ikon: bulan = gelap, matahari = terang
    themeIcon.className = theme === 'dark'
      ? 'fa-solid fa-sun'
      : 'fa-solid fa-moon';
  }
}


/* ----------------------------------------------------------------
   3. NAVBAR — Scroll Effect, Hamburger Menu, Active Link
   ---------------------------------------------------------------- */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.navbar__link');
  const overlay   = document.getElementById('overlay');

  /* --- Efek scroll: tambah kelas 'scrolled' setelah 80px --- */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);

    // Perbarui link aktif berdasarkan posisi scroll
    updateActiveNavLink();
  });

  /* --- Hamburger: buka/tutup menu mobile --- */
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());

    // Tampilkan overlay saat menu terbuka
    if (isOpen) {
      overlay.classList.add('active');
    } else {
      // Jangan tutup overlay jika ada modal yang terbuka
      if (!document.querySelector('.modal.active')) {
        overlay.classList.remove('active');
      }
    }
  });

  /* --- Tutup menu mobile saat klik link nav --- */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeNavMenu();
    });
  });

  /* --- Tutup menu mobile saat klik overlay --- */
  overlay.addEventListener('click', () => {
    closeNavMenu();
    closeAllModals();
  });

  function closeNavMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    // Hanya hapus overlay jika tidak ada modal aktif
    if (!document.querySelector('.modal.active')) {
      overlay.classList.remove('active');
    }
  }

  /* --- Smooth scroll untuk semua anchor link internal --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Perbarui link navbar yang aktif berdasarkan section yang sedang terlihat
 */
function updateActiveNavLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar__link');
  const navbar    = document.getElementById('navbar');
  const scrollPos = window.scrollY + navbar.offsetHeight + 50;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

function initNavHighlight() {
  updateActiveNavLink(); // Jalankan sekali saat load
}


/* ----------------------------------------------------------------
   4. MODAL — Login & Kontak (buka/tutup)
   ---------------------------------------------------------------- */
function initModals() {
  const overlay = document.getElementById('overlay');

  // === MODAL LOGIN ===
  const loginModal  = document.getElementById('loginModal');
  const loginClose  = document.getElementById('loginClose');
  const openLoginBtn = document.getElementById('openLoginBtn');

  openLoginBtn.addEventListener('click', () => openModal(loginModal));
  loginClose.addEventListener('click', () => closeModal(loginModal));

  // === MODAL KONTAK ===
  const contactModal         = document.getElementById('contactModal');
  const contactClose         = document.getElementById('contactClose');
  const openContactNavBtn    = document.getElementById('openContactNavBtn');
  const openContactSectionBtn = document.getElementById('openContactSectionBtn');
  const heroContactBtn       = document.getElementById('heroContactBtn');

  openContactNavBtn.addEventListener('click',    () => openModal(contactModal));
  openContactSectionBtn.addEventListener('click', () => openModal(contactModal));
  heroContactBtn.addEventListener('click',       () => openModal(contactModal));
  contactClose.addEventListener('click',         () => closeModal(contactModal));

  // Tutup modal dengan tombol Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

/**
 * Buka modal tertentu
 * @param {HTMLElement} modal
 */
function openModal(modal) {
  const overlay = document.getElementById('overlay');
  closeAllModals(); // Tutup modal lain jika ada yang terbuka
  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Cegah scroll body

  // Fokus ke elemen pertama di modal
  const firstInput = modal.querySelector('input, button');
  if (firstInput) setTimeout(() => firstInput.focus(), 300);
}

/**
 * Tutup modal tertentu
 * @param {HTMLElement} modal
 */
function closeModal(modal) {
  const overlay = document.getElementById('overlay');
  modal.classList.remove('active');

  // Hanya hapus overlay jika tidak ada modal lain yang aktif
  if (!document.querySelector('.modal.active')) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/** Tutup semua modal yang aktif */
function closeAllModals() {
  const overlay = document.getElementById('overlay');
  document.querySelectorAll('.modal.active').forEach(m => {
    m.classList.remove('active');
  });

  // Cek apakah menu mobile terbuka
  const navMenu = document.getElementById('navMenu');
  if (!navMenu.classList.contains('open')) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}


/* ----------------------------------------------------------------
   5. FORM LOGIN — Validasi & Simulasi Autentikasi
   ---------------------------------------------------------------- */
function initLoginForm() {
  const form          = document.getElementById('loginForm');
  const emailInput    = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const emailError    = document.getElementById('loginEmailError');
  const passwordError = document.getElementById('loginPasswordError');
  const loginAlert    = document.getElementById('loginAlert');
  const togglePwd     = document.getElementById('togglePassword');

  /* --- Data akun demo (simulasi, tanpa backend) --- */
  const DEMO_ACCOUNTS = [
    { email: 'admin@nurulhidayah.sch.id', password: 'admin123', role: 'Administrator' },
    { email: 'guru@nurulhidayah.sch.id',  password: 'guru123',  role: 'Guru'          },
    { email: 'siswa@nurulhidayah.sch.id', password: 'siswa123', role: 'Siswa'         },
  ];

  /* --- Toggle tampilkan/sembunyikan password --- */
  togglePwd.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePwd.querySelector('i').className = isPassword
      ? 'fa-solid fa-eye-slash'
      : 'fa-solid fa-eye';
    togglePwd.setAttribute('aria-label', isPassword ? 'Sembunyikan password' : 'Tampilkan password');
  });

  /* --- Hapus error saat mengetik --- */
  emailInput.addEventListener('input', () => clearFieldError(emailInput, emailError));
  passwordInput.addEventListener('input', () => clearFieldError(passwordInput, passwordError));

  /* --- Submit form login --- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const email    = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validasi email
    if (!email) {
      showFieldError(emailInput, emailError, 'Email tidak boleh kosong.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, emailError, 'Format email tidak valid.');
      valid = false;
    }

    // Validasi password
    if (!password) {
      showFieldError(passwordInput, passwordError, 'Kata sandi tidak boleh kosong.');
      valid = false;
    } else if (password.length < 6) {
      showFieldError(passwordInput, passwordError, 'Kata sandi minimal 6 karakter.');
      valid = false;
    }

    if (!valid) return;

    // Simulasi pengecekan akun
    const account = DEMO_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );

    if (account) {
      showAlert(loginAlert, 'success',
        `<i class="fa-solid fa-circle-check"></i> Selamat datang! Login sebagai <strong>${account.role}</strong>.`
      );
      // Simulasi redirect atau aksi setelah login
      setTimeout(() => {
        closeAllModals();
        loginAlert.style.display = 'none';
        form.reset();
      }, 2500);
    } else {
      showAlert(loginAlert, 'error',
        `<i class="fa-solid fa-circle-xmark"></i> Email atau kata sandi salah. Silakan coba lagi.`
      );
    }
  });
}


/* ----------------------------------------------------------------
   6. FORM KONTAK — Validasi & Simulasi Pengiriman Pesan
   ---------------------------------------------------------------- */
function initContactForm() {
  const form           = document.getElementById('contactForm');
  const nameInput      = document.getElementById('contactName');
  const emailInput     = document.getElementById('contactEmail');
  const subjectInput   = document.getElementById('contactSubject');
  const messageInput   = document.getElementById('contactMessage');
  const nameError      = document.getElementById('contactNameError');
  const emailError     = document.getElementById('contactEmailError');
  const subjectError   = document.getElementById('contactSubjectError');
  const messageError   = document.getElementById('contactMessageError');
  const contactAlert   = document.getElementById('contactAlert');

  /* --- Hapus error saat user mengetik --- */
  nameInput.addEventListener('input',    () => clearFieldError(nameInput,    nameError));
  emailInput.addEventListener('input',   () => clearFieldError(emailInput,   emailError));
  subjectInput.addEventListener('input', () => clearFieldError(subjectInput, subjectError));
  messageInput.addEventListener('input', () => clearFieldError(messageInput, messageError));

  /* --- Submit form kontak --- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Validasi Nama
    if (!name) {
      showFieldError(nameInput, nameError, 'Nama tidak boleh kosong.');
      valid = false;
    } else if (name.length < 3) {
      showFieldError(nameInput, nameError, 'Nama minimal 3 karakter.');
      valid = false;
    }

    // Validasi Email
    if (!email) {
      showFieldError(emailInput, emailError, 'Email tidak boleh kosong.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, emailError, 'Format email tidak valid.');
      valid = false;
    }

    // Validasi Subjek
    if (!subject) {
      showFieldError(subjectInput, subjectError, 'Subjek tidak boleh kosong.');
      valid = false;
    }

    // Validasi Pesan
    if (!message) {
      showFieldError(messageInput, messageError, 'Pesan tidak boleh kosong.');
      valid = false;
    } else if (message.length < 10) {
      showFieldError(messageInput, messageError, 'Pesan minimal 10 karakter.');
      valid = false;
    }

    if (!valid) return;

    // Simulasi loading pengiriman pesan
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
    submitBtn.disabled  = true;

    // Simulasi delay pengiriman (1.5 detik)
    setTimeout(() => {
      showAlert(contactAlert, 'success',
        `<i class="fa-solid fa-circle-check"></i> Pesan berhasil dikirim! Admin akan menghubungi Anda secepatnya, ${name}.`
      );
      form.reset();
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Pesan';
      submitBtn.disabled  = false;

      // Tutup modal setelah 3 detik
      setTimeout(() => {
        closeAllModals();
        contactAlert.style.display = 'none';
      }, 3000);
    }, 1500);
  });
}


/* ----------------------------------------------------------------
   7. ANIMASI COUNTER / ANGKA STATISTIK DI HERO
   ---------------------------------------------------------------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.hero__stat-number[data-target]');
  let animated   = false;

  /**
   * Animasi menghitung angka dari 0 ke target
   */
  function animateCounters() {
    if (animated) return;

    const heroSection = document.getElementById('hero');
    const heroBottom  = heroSection.getBoundingClientRect().bottom;

    // Trigger saat statistik mulai terlihat
    if (heroBottom > window.innerHeight * 0.4) {
      animated = true;
      counters.forEach(counter => {
        const target   = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 1800; // ms
        const step     = 16;   // ~60fps
        const increment = target / (duration / step);
        let current    = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, step);
      });
    }
  }

  // Dengarkan event scroll untuk trigger animasi
  window.addEventListener('scroll', animateCounters, { passive: true });
  // Jalankan sekali saat halaman dimuat (jika langsung di hero)
  animateCounters();
}


/* ----------------------------------------------------------------
   8. FILTER GALERI FOTO
   ---------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.galeri__filter-btn');
  const galeriItems = document.querySelectorAll('.galeri__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Perbarui tombol aktif
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Tampilkan/sembunyikan item galeri
      galeriItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          // Tampilkan item dengan animasi fade-in
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn .4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Tambahkan keyframe animasi fadeIn secara dinamis
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(.95); }
      to   { opacity: 1; transform: scale(1);   }
    }
  `;
  document.head.appendChild(styleSheet);
}


/* ----------------------------------------------------------------
   9. TOMBOL BACK TO TOP
   ---------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    // Tampilkan tombol setelah scroll 400px
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ----------------------------------------------------------------
   10. TAHUN FOOTER — Otomatis update
   ---------------------------------------------------------------- */
function initFooterYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}


/* ================================================================
   HELPER FUNCTIONS — Fungsi pembantu yang digunakan berulang
   ================================================================ */

/**
 * Validasi format email menggunakan regex
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Tampilkan pesan error pada field form
 * @param {HTMLElement} input - Elemen input
 * @param {HTMLElement} errorEl - Elemen teks error
 * @param {string} message - Pesan error
 */
function showFieldError(input, errorEl, message) {
  input.classList.add('error');
  input.classList.remove('success');
  errorEl.textContent = message;
}

/**
 * Bersihkan pesan error pada field form
 * @param {HTMLElement} input
 * @param {HTMLElement} errorEl
 */
function clearFieldError(input, errorEl) {
  input.classList.remove('error');
  if (input.value.trim()) input.classList.add('success');
  errorEl.textContent = '';
}

/**
 * Tampilkan alert sukses/gagal di dalam form
 * @param {HTMLElement} alertEl - Elemen alert
 * @param {string} type - 'success' atau 'error'
 * @param {string} html - Konten HTML pesan
 */
function showAlert(alertEl, type, html) {
  alertEl.innerHTML   = html;
  alertEl.className   = `form-group__alert ${type}`;
  alertEl.style.display = 'block';

  // Gulir ke alert agar terlihat
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
