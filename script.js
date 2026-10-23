/**
 * Ayan Khan - Portfolio Scripts
 * Handles Theme Toggling, Project Live Search/Filtering, and Contact Form.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Current Year in Footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Theme Toggle (Desktop & Mobile)
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const themeText = document.getElementById("theme-text");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      if (themeIcon) themeIcon.textContent = "\u2600"; // Sun icon
      if (themeText) themeText.textContent = "Light";
    } else {
      if (themeIcon) themeIcon.textContent = "\u263D"; // Moon icon
      if (themeText) themeText.textContent = "Dark";
    }
  }

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("theme");
  } catch (e) {}

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      const expanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", !expanded);
      navLinks.classList.toggle("active");
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 4. Project Search & Filter (Task 3)
  const searchInput = document.getElementById("projectSearch");
  const clearSearchBtn = document.getElementById("clearSearch");
  const filterPills = document.querySelectorAll(".pill-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const projectsCount = document.getElementById("projectsCount");
  const noProjectsNotice = document.getElementById("noProjectsNotice");

  let activeCategory = "all";
  let activeSearchTerm = "";

  function filterProjects() {
    const term = activeSearchTerm.trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach(card => {
      const name = (card.querySelector(".project-name")?.textContent || "").toLowerCase();
      const summary = (card.querySelector(".project-summary")?.textContent || "").toLowerCase();
      const tags = (card.getAttribute("data-tags") || "").toLowerCase();
      const category = (card.getAttribute("data-category") || "").toLowerCase();

      // Category matching
      const matchesCategory = (activeCategory === "all") || category.includes(activeCategory);

      // Search term matching (across name, description, and tags)
      const matchesSearch = !term ||
        name.includes(term) ||
        summary.includes(term) ||
        tags.includes(term);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Update count indicator
    if (projectsCount) {
      projectsCount.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
    }

    // Empty state
    if (noProjectsNotice) {
      noProjectsNotice.style.display = visibleCount === 0 ? "block" : "none";
    }

    // Toggle clear button
    if (clearSearchBtn) {
      clearSearchBtn.style.display = term.length > 0 ? "block" : "none";
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearchTerm = e.target.value;
      filterProjects();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      activeSearchTerm = "";
      filterProjects();
      searchInput.focus();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.getAttribute("data-category") || "all";
      filterProjects();
    });
  });

  // 5. Contact Form Handler (Opens visitor email client)
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const RECEIVING_EMAIL = "ayankhanbebea@gmail.com";

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const name = data.get("name");
      const senderEmail = data.get("email");
      const message = data.get("message");

      const subject = encodeURIComponent(`Portfolio Message from ${name}`);
      const body = encodeURIComponent(
        `Hi Ayan,\n\n${message}\n\nFrom: ${name} (${senderEmail})`
      );

      window.location.href = `mailto:${RECEIVING_EMAIL}?subject=${subject}&body=${body}`;
      if (formStatus) {
        formStatus.textContent = "Opening your default email application...";
      }
      contactForm.reset();
    });
  }
});
