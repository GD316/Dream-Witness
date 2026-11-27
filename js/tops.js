(() => {
  document.querySelectorAll('.preview-product-card').forEach((card) => {
    const button = card.querySelector('[data-view-toggle]');
    if (!button) return;
    const name = button.dataset.viewToggle;
    button.addEventListener('click', () => {
      const showingGarment = card.classList.toggle('is-garment-view');
      button.setAttribute('aria-pressed', String(showingGarment));
      button.setAttribute(
        'aria-label',
        showingGarment
          ? 'Show model photo for ' + name
          : 'Show garment-only view for ' + name
      );
    });
  });

  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-navigation');
  const closeMenu = () => {
    if (!toggle || !navigation) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };

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
})();