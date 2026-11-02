/**
 * SMARTPRINT BY ADHITRA — Product Website Scripts
 * Features:
 *  - Header Scroll State & Reading Progress Bar
 *  - Responsive Mobile Navigation Drawer
 *  - Rock-Solid Active Nav Scroll-Spy & Smooth Indicator Line
 *  - Interface Showcase Train / Carousel (Auto-scroll, Category Filters, Swipe/Drag, Dots)
 *  - Full-Resolution UI Screenshot Lightbox
 *  - Universal Interactive Email Modal & Direct Gmail Fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const productNav = document.getElementById('product-nav');

  if (menuToggle && productNav) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !productNav.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      productNav.classList.toggle('open', isOpen);
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking any nav link
    productNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (productNav.classList.contains('open') && !productNav.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && productNav.classList.contains('open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });
  }

  // 2. Header Scrolled State & Top Reading Progress Bar
  const siteHeader = document.getElementById('header');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');

  const handleHeaderMetrics = () => {
    const scrollY = window.scrollY;
    
    // Scrolled class for glassmorphism
    if (scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    // Top scroll progress bar calculation
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };

  window.addEventListener('scroll', handleHeaderMetrics, { passive: true });
  handleHeaderMetrics();

  // 3. Section Scroll-Spy for Top Bar Active Indicator Animation
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-item');

  const sectionMap = {
    overview: '#overview',
    problem: '#overview',
    workflow: '#workflow',
    features: '#features',
    interface: '#interface',
    architecture: '#architecture',
    hardware: '#architecture',
    status: '#status',
    contact: '#status'
  };

  const setActiveNav = (targetHref) => {
    navItems.forEach((link) => {
      if (link.getAttribute('href') === targetHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  if ('IntersectionObserver' in window && sections.length > 0 && navItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const targetHref = sectionMap[id] || `#${id}`;
          setActiveNav(targetHref);
        }
      });
    }, observerOptions);

    sections.forEach((section) => spyObserver.observe(section));

    // Reset to overview when scrolled near the top
    window.addEventListener('scroll', () => {
      if (window.scrollY < 80) {
        setActiveNav('#overview');
      }
    }, { passive: true });
  }

  // Handle immediate visual feedback when clicking any nav item
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href) setActiveNav(href);
    });
  });

  // 4. Interface Train Showcase / Auto-Scroll Carousel
  const trainViewport = document.getElementById('gallery-train-viewport');
  const trainTrack = document.getElementById('gallery-train-track');
  const trainPrevBtn = document.getElementById('train-prev');
  const trainNextBtn = document.getElementById('train-next');
  const trainPauseToggle = document.getElementById('train-pause-toggle');
  const dotsContainer = document.getElementById('gallery-train-dots');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');

  if (trainTrack && trainViewport) {
    let allCards = Array.from(trainTrack.querySelectorAll('.train-car-card'));
    let activeCards = [...allCards];
    let currentIndex = 0;
    let isAutoScrolling = true;
    let autoScrollTimer = null;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    // Render / Update Dots based on active cards
    const updateDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      activeCards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `train-dot ${idx === currentIndex ? 'active' : ''}`;
        dot.setAttribute('data-index', String(idx));
        dot.setAttribute('aria-label', `Jump to slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoScrollTimer();
        });
        dotsContainer.appendChild(dot);
      });
    };

    // Calculate Card Width & Gap
    const getCardMetrics = () => {
      if (activeCards.length === 0) return { width: 350, gap: 22 };
      const card = activeCards[0];
      const width = card.offsetWidth;
      const gap = parseFloat(getComputedStyle(trainTrack).gap) || 22;
      return { width, gap };
    };

    // Go to specific slide index
    const goToSlide = (index) => {
      if (activeCards.length === 0) return;
      if (index >= activeCards.length) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = activeCards.length - 1;
      } else {
        currentIndex = index;
      }

      const { width, gap } = getCardMetrics();
      const offset = currentIndex * (width + gap);
      trainTrack.style.transform = `translateX(-${offset}px)`;

      // Update active dot
      const dots = dotsContainer?.querySelectorAll('.train-dot') || [];
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    // Auto-Scroll Step
    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    const startAutoScroll = () => {
      stopAutoScroll();
      if (!isAutoScrolling) return;
      autoScrollTimer = setInterval(nextSlide, 3800);
    };

    const stopAutoScroll = () => {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    };

    const resetAutoScrollTimer = () => {
      if (isAutoScrolling) {
        startAutoScroll();
      }
    };

    // Prev / Next Button listeners
    trainNextBtn?.addEventListener('click', () => {
      nextSlide();
      resetAutoScrollTimer();
    });

    trainPrevBtn?.addEventListener('click', () => {
      prevSlide();
      resetAutoScrollTimer();
    });

    // Pause on Hover / Focus
    trainViewport.addEventListener('mouseenter', stopAutoScroll);
    trainViewport.addEventListener('mouseleave', () => {
      if (isAutoScrolling) startAutoScroll();
    });

    // Manual Pause / Resume Toggle
    if (trainPauseToggle) {
      trainPauseToggle.addEventListener('click', () => {
        isAutoScrolling = !isAutoScrolling;
        trainPauseToggle.classList.toggle('paused', !isAutoScrolling);
        const textSpan = trainPauseToggle.querySelector('.pause-text');
        if (textSpan) {
          textSpan.textContent = isAutoScrolling ? 'Auto-Scroll' : 'Paused';
        }
        if (isAutoScrolling) {
          startAutoScroll();
        } else {
          stopAutoScroll();
        }
      });
    }

    // Category Filter Buttons
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';

        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        activeCards = allCards.filter(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            return true;
          } else {
            card.style.display = 'none';
            return false;
          }
        });

        currentIndex = 0;
        trainTrack.style.transform = 'translateX(0px)';
        updateDots();
        resetAutoScrollTimer();
      });
    });

    // Touch Swipe & Drag Handling for Mobile
    trainViewport.addEventListener('touchstart', (e) => {
      stopAutoScroll();
      startX = e.touches[0].clientX;
    }, { passive: true });

    trainViewport.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      resetAutoScrollTimer();
    }, { passive: true });

    // Initialize dots and start auto-scroll train
    updateDots();
    startAutoScroll();

    // Recalculate on window resize
    window.addEventListener('resize', () => {
      goToSlide(currentIndex);
    }, { passive: true });
  }

  // 5. Full-Resolution UI Screenshot Lightbox
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');

  const openLightbox = (src, title) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || 'SmartPrint Interface Screenshot';
    if (lightboxTitle) lightboxTitle.textContent = title || 'SmartPrint Interface Preview';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.zoomable-ui').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = item.querySelector('img') || item.closest('.train-car-card')?.querySelector('img');
      const title = item.getAttribute('data-title') || 
                    item.closest('.train-car-card')?.querySelector('.train-car-title')?.textContent || 
                    (img ? img.alt : 'SmartPrint UI');
      if (img && img.src) {
        openLightbox(img.src, title);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 6. Universal Interactive Email Modal & Direct Mailto Handler
  const emailModal = document.getElementById('contact-email-modal');
  const emailModalClose = document.getElementById('email-modal-close');
  const emailModalCopyBtn = document.getElementById('email-modal-copy-btn');
  const emailModalAddress = document.getElementById('email-modal-address');
  const emailModalGmailBtn = document.getElementById('email-modal-gmail-btn');
  const emailModalNativeBtn = document.getElementById('email-modal-native-btn');

  const closeEmailModal = () => {
    if (!emailModal) return;
    emailModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openEmailModal = (email, subject, originalHref) => {
    // 1. Copy to clipboard immediately
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }

    if (emailModalAddress) emailModalAddress.textContent = email;
    if (emailModalCopyBtn) emailModalCopyBtn.textContent = '📋 Copy';

    // 2. Set direct Gmail web compose URL
    if (emailModalGmailBtn) {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}`;
      emailModalGmailBtn.href = gmailUrl;
    }

    // 3. Set native mailto
    if (emailModalNativeBtn) {
      emailModalNativeBtn.href = originalHref;
    }

    if (emailModal) {
      emailModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Also trigger floating toast notification
    showBrandToast(email);
  };

  if (emailModalClose) {
    emailModalClose.addEventListener('click', closeEmailModal);
  }

  if (emailModal) {
    emailModal.addEventListener('click', (e) => {
      if (e.target === emailModal) {
        closeEmailModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && emailModal && emailModal.classList.contains('active')) {
      closeEmailModal();
    }
  });

  if (emailModalCopyBtn) {
    emailModalCopyBtn.addEventListener('click', () => {
      const email = emailModalAddress?.textContent || 'adhitra.dev@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          emailModalCopyBtn.textContent = '✓ Copied!';
          setTimeout(() => {
            if (emailModalCopyBtn) emailModalCopyBtn.textContent = '📋 Copy';
          }, 2500);
        }).catch(() => {});
      }
    });
  }

  // Intercept all mailto: links on the page
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Stop silent drop by OS
      const href = link.getAttribute('href') || '';
      const emailMatch = href.match(/mailto:([^?]+)/);
      const email = emailMatch ? emailMatch[1] : 'adhitra.dev@gmail.com';
      const subjectMatch = href.match(/[?&]subject=([^&]+)/);
      const subject = subjectMatch ? decodeURIComponent(subjectMatch[1]) : 'SmartPrint Pilot Partnership Enquiry';

      openEmailModal(email, subject, href);
    });
  });

  // Floating Brand Toast Helper
  const showBrandToast = (email) => {
    let toast = document.getElementById('adhitra-mail-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adhitra-mail-toast';
      toast.style.cssText =
        "position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px); " +
        "background: rgba(7, 23, 29, 0.96); border: 1px solid #00E5D4; color: #EAF4F2; " +
        "padding: 14px 22px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; " +
        "box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 229, 212, 0.25); " +
        "display: flex; align-items: center; gap: 14px; z-index: 9999999; opacity: 0; pointer-events: none; " +
        "transition: opacity 0.3s ease, transform 0.3s ease;";
      document.body.appendChild(toast);
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    toast.innerHTML = `
      <span style="display:flex; align-items:center; gap:8px;">
        <strong style="color:#00E5D4;">✓ Email Copied:</strong> ${email}
      </span>
      <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" 
         style="background: #009E9B; color: #fff; font-weight: 700; font-size: 0.8rem; padding: 5px 12px; border-radius: 5px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
        Open in Gmail ↗
      </a>
    `;

    toast.style.pointerEvents = 'auto';
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      if (toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        toast.style.pointerEvents = 'none';
      }
    }, 4500);
  };

  // 7. Smooth Scroll-Triggered Section Reveals (Corporate Standard)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
});
