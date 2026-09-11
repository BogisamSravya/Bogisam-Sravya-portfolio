/**
 * Sravya Bogisam - Portfolio Main Controller
 * Orchestrates animations, dynamic rendering, theme toggling, and interactive components.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initParticleBackground();
  initDynamicTyping();
  initNavigation();
  renderAcademicStats();
  renderExposureAndSoftSkills();
  renderSkillsSection();
  renderCertifications();
  renderRoadmap();
  initLabsTabs();
  initContactForm();
  initScrollReveals();

  // Initialize interactive labs from interactive-labs.js
  if (typeof window.initPortfolioLabs === "function") {
    window.initPortfolioLabs();
  }
});

/* ==========================================================================
   THEME TOGGLING (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("sravya_theme") || "dark";

  document.documentElement.setAttribute("data-theme", storedTheme);
  updateThemeIcon(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("sravya_theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;
  if (theme === "light") {
    toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    toggleBtn.setAttribute("aria-label", "Switch to dark theme");
  } else {
    toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    toggleBtn.setAttribute("aria-label", "Switch to light theme");
  }
}

/* ==========================================================================
   INTERACTIVE CONSTELLATION / PARTICLE CANVAS
   ========================================================================== */
function initParticleBackground() {
  const canvas = document.getElementById("hero-particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 65;
  const maxDistance = 120;
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY <= rect.bottom && e.clientY >= rect.top) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(6, 182, 212, 0.65)";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.22})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   DYNAMIC ROLE TYPING EFFECT
   ========================================================================== */
function initDynamicTyping() {
  const el = document.getElementById("typing-role");
  if (!el) return;

  const roles = [
    "Aspiring AI/ML Engineer",
    "Computer Science Undergraduate",
    "Python & Generative AI Developer",
    "Data Analysis & Problem Solver"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 45;
  const delayAfterWord = 1800;

  function type() {
    const currentWord = roles[roleIdx];

    if (!isDeleting) {
      el.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === currentWord.length) {
        isDeleting = true;
        setTimeout(type, delayAfterWord);
        return;
      }
    } else {
      el.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  type();
}

/* ==========================================================================
   STICKY NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isOpen = navMenu.classList.contains("open");
      mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
}

/* ==========================================================================
   RENDER ACADEMIC STATS STRIP
   ========================================================================== */
function renderAcademicStats() {
  const container = document.getElementById("stats-strip-container");
  if (!container || !portfolioData || !portfolioData.academicStats) return;

  container.innerHTML = portfolioData.academicStats
    .map(
      (s) => `
    <div class="stat-card reveal-on-scroll">
      <div class="stat-value">
        <span class="text-gradient">${s.value}</span>
        <span class="stat-suffix">${s.suffix}</span>
      </div>
      <div class="stat-label">${s.label}</div>
    </div>
  `
    )
    .join("");
}

/* ==========================================================================
   RENDER ABOUT EXPOSURE & SOFT SKILLS
   ========================================================================== */
function renderExposureAndSoftSkills() {
  const exposureContainer = document.getElementById("academic-exposure-container");
  const softSkillsContainer = document.getElementById("soft-skills-container");

  if (exposureContainer && portfolioData.academicExposure) {
    exposureContainer.innerHTML = portfolioData.academicExposure
      .map(
        (item) => `
      <div class="exposure-card reveal-on-scroll">
        <div class="exposure-header">
          <h4 class="exposure-title">${item.title}</h4>
          <span class="exposure-badge">${item.badge}</span>
        </div>
        <p class="exposure-desc">${item.desc}</p>
      </div>
    `
      )
      .join("");
  }

  if (softSkillsContainer && portfolioData.softSkills) {
    softSkillsContainer.innerHTML = portfolioData.softSkills
      .map(
        (skill) => `
      <div class="soft-skill-pill reveal-on-scroll">
        <div class="soft-skill-icon">
          <i class="fa-solid fa-${skill.icon}"></i>
        </div>
        <div>
          <h4 class="soft-skill-title">${skill.name}</h4>
          <p class="soft-skill-desc">${skill.desc}</p>
        </div>
      </div>
    `
      )
      .join("");
  }
}

/* ==========================================================================
   RENDER TECHNICAL SKILLS WITH CATEGORY TABS
   ========================================================================== */
function renderSkillsSection() {
  const tabsContainer = document.getElementById("skills-tabs");
  const cardsContainer = document.getElementById("skills-container");
  if (!tabsContainer || !cardsContainer || !portfolioData.skillCategories) return;

  let activeCatId = portfolioData.skillCategories[0].id;

  function renderTabs() {
    tabsContainer.innerHTML = portfolioData.skillCategories
      .map(
        (cat) => `
      <button class="skill-tab-btn ${cat.id === activeCatId ? "active" : ""}" data-cat-id="${cat.id}">
        <i class="fa-solid fa-${cat.icon}"></i>
        ${cat.name}
      </button>
    `
      )
      .join("");

    tabsContainer.querySelectorAll(".skill-tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.currentTarget;
        activeCatId = target.getAttribute("data-cat-id");
        renderTabs();
        renderCards();
      });
    });
  }

  function renderCards() {
    const currentCategory = portfolioData.skillCategories.find((c) => c.id === activeCatId);
    if (!currentCategory) return;

    cardsContainer.innerHTML = currentCategory.skills
      .map(
        (s) => `
      <div class="skill-card reveal-on-scroll is-revealed">
        <div>
          <div class="skill-card-top">
            <h4 class="skill-name">${s.name}</h4>
            <span class="skill-tag">${s.tag}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
            Proficiency & Applied Mastery
          </p>
        </div>
        <div class="skill-progress-wrap">
          <div class="skill-progress-bar">
            <div class="skill-progress-fill" style="width: ${s.level}%"></div>
          </div>
          <div class="skill-percent-text">${s.level}%</div>
        </div>
      </div>
    `
      )
      .join("");
  }

  renderTabs();
  renderCards();
}

/* ==========================================================================
   RENDER CERTIFICATIONS WITH CATEGORY FILTER (20+ VERIFIED CREDENTIALS)
   ========================================================================== */
function renderCertifications() {
  const filterContainer = document.getElementById("cert-filter-container");
  const gridContainer = document.getElementById("certs-grid-container");
  if (!filterContainer || !gridContainer || !portfolioData.certifications) return;

  const filters = [
    { id: "all", label: "All Certifications (21)" },
    { id: "ai", label: "AI & Machine Learning" },
    { id: "programming", label: "Programming & Algorithms" },
    { id: "cybersecurity", label: "Cybersecurity & Defense" },
    { id: "web", label: "Web, Cloud & Systems" }
  ];

  let currentFilter = "all";

  function renderFilterButtons() {
    filterContainer.innerHTML = filters
      .map(
        (f) => `
      <button class="cert-filter-btn ${f.id === currentFilter ? "active" : ""}" data-filter="${f.id}">
        ${f.label}
      </button>
    `
      )
      .join("");

    filterContainer.querySelectorAll(".cert-filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        currentFilter = e.currentTarget.getAttribute("data-filter");
        renderFilterButtons();
        renderCertsGrid();
      });
    });
  }

  function renderCertsGrid() {
    const certs =
      currentFilter === "all"
        ? portfolioData.certifications
        : portfolioData.certifications.filter((c) => c.category === currentFilter);

    gridContainer.innerHTML = certs
      .map(
        (cert) => `
      <div class="cert-card reveal-on-scroll is-revealed">
        <div>
          <div class="cert-top-row">
            <span class="cert-badge">${cert.badgeText}</span>
            <span class="cert-status-tag">
              <i class="fa-solid fa-circle-check"></i> Verified
            </span>
          </div>
          <h4 class="cert-title">${cert.title}</h4>
          <p class="cert-issuer"><i class="fa-solid fa-graduation-cap"></i> ${cert.issuer}</p>
        </div>
        <p class="cert-highlights">${cert.highlights}</p>
      </div>
    `
      )
      .join("");
  }

  renderFilterButtons();
  renderCertsGrid();
}

/* ==========================================================================
   RENDER UPCOMING ROADMAP
   ========================================================================== */
function renderRoadmap() {
  const container = document.getElementById("roadmap-grid-container");
  if (!container || !portfolioData.upcomingProjectsRoadmap) return;

  container.innerHTML = portfolioData.upcomingProjectsRoadmap
    .map(
      (item) => `
    <div class="roadmap-card reveal-on-scroll">
      <div>
        <div class="roadmap-status">
          <i class="fa-solid fa-spinner fa-spin"></i> ${item.status}
        </div>
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </div>
      <div class="roadmap-tags">
        ${item.tags.map((t) => `<span class="tech-tag">${t}</span>`).join("")}
      </div>
    </div>
  `
    )
    .join("");
}

/* ==========================================================================
   INTERACTIVE LABS TABS
   ========================================================================== */
function initLabsTabs() {
  const triggers = document.querySelectorAll(".lab-tab-trigger");
  const panes = document.querySelectorAll(".lab-pane");

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-lab-target");

      triggers.forEach((t) => t.classList.remove("active"));
      panes.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");
    });
  });
}

/* ==========================================================================
   CONTACT FORM & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const toast = document.getElementById("toast-notification");
  const toastMsg = document.getElementById("toast-text");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("sender-name").value.trim();
    const email = document.getElementById("sender-email").value.trim();
    const message = document.getElementById("sender-message").value.trim();
    const submitBtn = document.getElementById("contact-submit-btn");

    if (!name || !email || !message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span> Sending...`;
    }

    // Simulate sending message
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Message`;
      }
      form.reset();
      showToast(`Thank you, ${name}! Your message has been prepared for Sravya.`, "success");
    }, 900);
  });

  function showToast(text, type = "success") {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = text;
    toast.style.borderColor = type === "success" ? "var(--accent-emerald)" : "var(--accent-rose)";
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
}

/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}
