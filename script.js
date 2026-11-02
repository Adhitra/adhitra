/**
 * ADHITRA — Corporate Website Interaction Scripts
 * Functional Features:
 *  - Responsive mobile menu with ARIA state & keyboard trap/escape support
 *  - Header scroll state & glassmorphic transition
 *  - Section scroll-spy & active navigation indicator
 *  - Dynamic copyright year
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Copyright Year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Responsive Mobile Navigation
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const header = document.getElementById("header");

  function closeMenu() {
    if (mainNav && menuToggle) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }

  function openMenu() {
    if (mainNav && menuToggle) {
      mainNav.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
    }
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close mobile menu on nav link click
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Close on Escape key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mainNav.classList.contains("open")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close when clicking outside of header / navigation
    document.addEventListener("click", (e) => {
      if (mainNav.classList.contains("open")) {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
          closeMenu();
        }
      }
    });
  }

  // 3. Header Scroll Styling
  function updateHeaderOnScroll() {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  }

  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll();

  // 4. Section Scroll-Spy / Active Navigation Highlighting
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-item");

  if ("IntersectionObserver" in window && sections.length > 0 && navItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navItems.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }
});
