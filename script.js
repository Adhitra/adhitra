/**
 * ADHITRA — Corporate Website Interaction Scripts
 * Functional Features:
 *  - Premium Hero Brand Identity Carousel (Slides 01, 02, 03)
 *    * Smooth controlled transitions
 *    * Tabbed indicators with progress bars
 *    * Prev / Next controls
 *    * Touch / Swipe gesture support
 *    * Keyboard accessible navigation (Left/Right arrows)
 *    * Auto-progression with interactive pause/resume
 *    * Respects prefers-reduced-motion
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

  // 5. Hero Brand Identity Carousel — Unidirectional Infinite Loop & Pausable Progress
  const carouselSection = document.getElementById("home");
  const carouselTrack = document.getElementById("carousel-track");
  const indicatorTabs = document.querySelectorAll(".indicator-tab");
  const prevBtn = document.getElementById("hero-prev");
  const nextBtn = document.getElementById("hero-next");

  // Prevent unwanted window auto-scroll to #home on page load
  if (window.location.hash === "#home") {
    if ("history" in window && history.replaceState) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }

  // Smooth Animated Scroll for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      if (targetId === "#home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeMenu();
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPos =
          targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

        window.scrollTo({
          top: Math.max(0, targetPos),
          behavior: "smooth",
        });

        closeMenu();
      }
    });
  });

  if (carouselSection && carouselTrack) {
    const originalSlides = Array.from(carouselTrack.querySelectorAll(".carousel-slide"));
    const totalOriginalSlides = originalSlides.length;

    if (totalOriginalSlides > 1) {
      // Mark original slides with their original index
      originalSlides.forEach((slide, idx) => {
        slide.setAttribute("data-original-index", String(idx));
      });

      // 1. Build Seamless Infinite Clones:
      // Clone Slide 3 and prepend before Slide 1
      // Clone Slide 1 and append after Slide 3
      const firstClone = originalSlides[0].cloneNode(true);
      const lastClone = originalSlides[totalOriginalSlides - 1].cloneNode(true);

      firstClone.classList.add("carousel-clone");
      firstClone.setAttribute("data-clone", "true");
      firstClone.setAttribute("data-original-index", "0");
      firstClone.setAttribute("aria-hidden", "true");
      firstClone.querySelectorAll("a, button").forEach((el) => el.setAttribute("tabindex", "-1"));
      // Strip duplicate IDs inside clone to keep DOM clean
      firstClone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));

      lastClone.classList.add("carousel-clone");
      lastClone.setAttribute("data-clone", "true");
      lastClone.setAttribute("data-original-index", String(totalOriginalSlides - 1));
      lastClone.setAttribute("aria-hidden", "true");
      lastClone.querySelectorAll("a, button").forEach((el) => el.setAttribute("tabindex", "-1"));
      lastClone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));

      carouselTrack.appendChild(firstClone);
      carouselTrack.insertBefore(lastClone, originalSlides[0]);

      // Track positions:
      // Index 0: Clone of Slide 3
      // Index 1: Original Slide 1
      // Index 2: Original Slide 2
      // Index 3: Original Slide 3
      // Index 4: Clone of Slide 1
      let currentTrackIndex = 1;
      let isTransitioning = false;
      const TRANSITION_STYLE = "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)";
      const SLIDE_DURATION = 6000; // 6s repeat scroll interval
      let slideStartTime = Date.now();
      let remainingTime = SLIDE_DURATION;
      let autoTimer = null;
      let isPaused = false;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // NO ENTRANCE SMOOTH ANIMATION:
      // Set initial position immediately with transition: none so Slide 1 appears statically on load
      carouselTrack.style.transition = "none";
      carouselTrack.style.transform = "translateX(-100%)";
      void carouselTrack.offsetWidth; // Force layout

      function getOriginalIndex(trackIdx) {
        return ((trackIdx - 1) % totalOriginalSlides + totalOriginalSlides) % totalOriginalSlides;
      }

      function updateSlideStates(origIdx) {
        const allSlides = carouselTrack.querySelectorAll(".carousel-slide");
        allSlides.forEach((slide) => {
          const sIdx = parseInt(slide.getAttribute("data-original-index"), 10);
          const isAct = sIdx === origIdx;
          slide.classList.toggle("active", isAct);
          if (!slide.hasAttribute("data-clone")) {
            slide.setAttribute("aria-hidden", String(!isAct));
          }
        });
      }

      function updateIndicators(origIdx) {
        indicatorTabs.forEach((tab, idx) => {
          const isAct = idx === origIdx;
          tab.classList.toggle("active", isAct);
          tab.setAttribute("aria-selected", String(isAct));
          if (!isAct) {
            tab.classList.remove("paused");
          }
        });

        // Re-trigger progress bar animation for active tab
        const activeTab = indicatorTabs[origIdx];
        if (activeTab) {
          const bar = activeTab.querySelector(".tab-progress");
          if (bar) {
            bar.style.animation = "none";
            void bar.offsetWidth; // Force reflow
            bar.style.animation = "";
          }
          if (isPaused) {
            activeTab.classList.add("paused");
          }
        }
      }

      function startTimer() {
        if (prefersReducedMotion || isPaused) return;
        clearTimeout(autoTimer);
        slideStartTime = Date.now();
        remainingTime = SLIDE_DURATION;
        autoTimer = setTimeout(autoAdvance, SLIDE_DURATION);
      }

      function stopTimer() {
        clearTimeout(autoTimer);
        autoTimer = null;
      }

      function autoAdvance() {
        if (isPaused) return;
        nextSlide();
      }

      function pauseCarousel() {
        if (isPaused) return;
        isPaused = true;
        stopTimer();
        const elapsed = Date.now() - slideStartTime;
        remainingTime = Math.max(200, remainingTime - elapsed);

        const activeOriginal = getOriginalIndex(currentTrackIndex);
        const activeTab = indicatorTabs[activeOriginal];
        if (activeTab) {
          activeTab.classList.add("paused");
        }
      }

      function resumeCarousel() {
        if (!isPaused) return;
        isPaused = false;

        const activeOriginal = getOriginalIndex(currentTrackIndex);
        const activeTab = indicatorTabs[activeOriginal];
        if (activeTab) {
          activeTab.classList.remove("paused");
        }

        if (!prefersReducedMotion) {
          stopTimer();
          slideStartTime = Date.now();
          autoTimer = setTimeout(autoAdvance, remainingTime);
        }
      }

      // Smooth horizontal track sliding transition
      function moveToTrackIndex(newTrackIndex) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentTrackIndex = newTrackIndex;

        const targetOriginal = getOriginalIndex(currentTrackIndex);
        updateIndicators(targetOriginal);
        updateSlideStates(targetOriginal);

        carouselTrack.style.transition = TRANSITION_STYLE;
        carouselTrack.style.transform = `translateX(-${currentTrackIndex * 100}%)`;

        startTimer();

        // Safety fallback to unblock transition flag if event fails
        setTimeout(() => {
          isTransitioning = false;
        }, 750);
      }

      function nextSlide() {
        if (isTransitioning) return;
        // From Slide 3 (index 3), advances smoothly to index 4 (Clone of Slide 1)
        // SLIDING SMOOTHLY TO THE LEFT! (translateX goes from -300% to -400%)
        moveToTrackIndex(currentTrackIndex + 1);
      }

      function prevSlide() {
        if (isTransitioning) return;
        // From Slide 1 (index 1), moves to index 0 (Clone of Slide 3)
        // Sliding smoothly to the right (translateX goes from -100% to 0%)
        moveToTrackIndex(currentTrackIndex - 1);
      }

      // Snap clones seamlessly without visual jump
      carouselTrack.addEventListener("transitionend", (e) => {
        if (e.target !== carouselTrack || e.propertyName !== "transform") return;

        // If we reached Clone of Slide 1 (at index 4), instantly snap back to Original Slide 1 (at index 1)
        if (currentTrackIndex === totalOriginalSlides + 1) {
          carouselTrack.style.transition = "none";
          currentTrackIndex = 1;
          carouselTrack.style.transform = "translateX(-100%)";
          void carouselTrack.offsetWidth; // Force reflow
        }
        // If we reached Clone of Slide 3 (at index 0), instantly snap back to Original Slide 3 (at index 3)
        else if (currentTrackIndex === 0) {
          carouselTrack.style.transition = "none";
          currentTrackIndex = totalOriginalSlides;
          carouselTrack.style.transform = `translateX(-${totalOriginalSlides * 100}%)`;
          void carouselTrack.offsetWidth; // Force reflow
        }

        isTransitioning = false;
      });

      // Indicator tab click handler:
      // Clicking Tab 01 from Tab 03 animates smoothly to the LEFT via the clone at index 4!
      indicatorTabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
          e.preventDefault();
          if (isTransitioning) return;

          const targetTabIdx = parseInt(tab.getAttribute("data-slide-index"), 10);
          const currentOrigIdx = getOriginalIndex(currentTrackIndex);

          if (targetTabIdx === currentOrigIdx) return;

          // Special case: moving forward from Slide 3 (tab 2) to Slide 1 (tab 0)
          // Must slide to the LEFT into Slide 1
          if (currentOrigIdx === totalOriginalSlides - 1 && targetTabIdx === 0) {
            moveToTrackIndex(totalOriginalSlides + 1); // Index 4 (Clone of Slide 1)
          }
          // Special case: moving backward from Slide 1 (tab 0) to Slide 3 (tab 2)
          else if (currentOrigIdx === 0 && targetTabIdx === totalOriginalSlides - 1) {
            moveToTrackIndex(0); // Index 0 (Clone of Slide 3)
          }
          // Standard jump to track index
          else {
            moveToTrackIndex(targetTabIdx + 1);
          }
        });
      });

      // Controls event listeners
      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          e.preventDefault();
          nextSlide();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
          e.preventDefault();
          prevSlide();
        });
      }

      // Pausable Automatic Repeat Scroll:
      // Hover Pause / Resume
      carouselSection.addEventListener("mouseenter", pauseCarousel);
      carouselSection.addEventListener("mouseleave", resumeCarousel);

      // Focus Pause / Resume
      carouselSection.addEventListener("focusin", pauseCarousel);
      carouselSection.addEventListener("focusout", resumeCarousel);

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (carouselSection.contains(document.activeElement)) {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            prevSlide();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            nextSlide();
          }
        }
      });

      // Touch / Swipe support with pause/resume
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;

      carouselSection.addEventListener(
        "touchstart",
        (e) => {
          pauseCarousel();
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
        },
        { passive: true }
      );

      carouselSection.addEventListener(
        "touchend",
        (e) => {
          touchEndX = e.changedTouches[0].screenX;
          touchEndY = e.changedTouches[0].screenY;
          handleSwipe();
          resumeCarousel();
        },
        { passive: true }
      );

      function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const minSwipeDistance = 40;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
          if (diffX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }

      // Initialize state for first slide with entrance animations
      updateSlideStates(0);
      updateIndicators(0);
      startTimer();

      // Cleanly conclude entrance animation after it finishes running
      setTimeout(() => {
        carouselSection.classList.remove("hero-entering");
      }, 1400);
    }
  }

  // 6. Smooth Scroll-Triggered Section Reveals
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-revealed"));
  }
});
