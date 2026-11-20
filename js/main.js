(() => {
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dot')];
  const hero = document.querySelector('.hero');
  let activeIndex = 0;
  let timer = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncBannerVideo() {
    const video = slides[1]?.querySelector('.hero-banner-video');
    if (!video) return;
    if (activeIndex === 1 && !document.hidden && !reducedMotion) {
      const playback = video.play();
      if (playback && typeof playback.catch === 'function') playback.catch(() => {});
    } else {
      video.pause();
    }
  }
  function showSlide(index, announce = false) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === activeIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, i) => {
      const active = i === activeIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', String(active));
    });
    if (announce) {
      const live = document.querySelector('.slide-status');
      if (live) live.textContent = `Banner ${activeIndex + 1} of ${slides.length}`;
    }
    hero?.classList.toggle('shows-mirror-tear', activeIndex === 2);
    syncBannerVideo();
  }

  function stopAutoplay() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }
  function startAutoplay() {
    stopAutoplay();
    if (reducedMotion || document.hidden) return;
    timer = window.setInterval(() => showSlide(activeIndex + 1), 7800);
  }

  dots.forEach((dot) => dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.goTo), true);
    startAutoplay();
  }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
      slides[1]?.querySelector('.hero-banner-video')?.pause();
    } else {
      startAutoplay();
      syncBannerVideo();
    }
  });
  startAutoplay();

  document.querySelectorAll('.wishlist-mark').forEach((button) => {
    const productId = button.dataset.productId;
    const productName = button.dataset.productName || 'item';
    const storageKey = `dream-witness:wishlist:${productId}`;
    const setSaved = (saved) => {
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', `${saved ? 'Remove' : 'Add'} ${productName} ${saved ? 'from' : 'to'} wishlist`);
    };

    try {
      setSaved(window.localStorage.getItem(storageKey) === 'true');
    } catch {
      setSaved(false);
    }

    button.addEventListener('click', () => {
      const saved = button.getAttribute('aria-pressed') !== 'true';
      setSaved(saved);
      try {
        window.localStorage.setItem(storageKey, String(saved));
      } catch {
        // The button still works for this page view when local storage is blocked.
      }
    });
  });

  const newsletterForm = document.querySelector('#newsletter-form');
  const newsletterStatus = document.querySelector('#newsletter-status');
  newsletterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput?.value.trim();
    if (!email || !emailInput.checkValidity()) {
      emailInput?.reportValidity();
      return;
    }

    const recipient = 'ckrgksehdwn@naver.com';
    const subject = encodeURIComponent('Dream Witness Newsletter Sign-up');
    const body = encodeURIComponent('Please add ' + email + ' to the Dream Witness newsletter.');
    if (newsletterStatus) newsletterStatus.textContent = 'Your email app will open with a sign-up request. Send it there to complete your signup.';
    window.location.href = 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;
  });

  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-navigation');
  function closeMenu() {
    if (!toggle || !navigation) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation?.classList.toggle('is-open', open);
  });
  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!navigation?.classList.contains('is-open')) return;
    if (!navigation.contains(event.target) && !toggle?.contains(event.target)) closeMenu();
  });
})();
