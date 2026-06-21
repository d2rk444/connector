(() => {
  'use strict';
  const app = document.getElementById('app');
  const MOBILE_KEY = 'constellation_mobile_drawer_initialized';
  const isMobile = () => window.matchMedia('(max-width: 980px)').matches;

  function setInitialMobileDrawer() {
    if (!app || !isMobile()) return;
    if (!localStorage.getItem(MOBILE_KEY)) {
      app.classList.add('sidebar-collapsed');
      localStorage.setItem(MOBILE_KEY, '1');
    }
  }

  window.addEventListener('resize', setInitialMobileDrawer, { passive: true });
  document.addEventListener('click', (event) => {
    if (!app || !isMobile()) return;
    if (event.target.closest('.item-row')) app.classList.add('sidebar-collapsed');
  });

  setInitialMobileDrawer();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
