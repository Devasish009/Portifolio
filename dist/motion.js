'use strict';
(() => {
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let saved = null;
  try { saved = localStorage.getItem('portfolio-motion'); } catch (_) {}
  let enabled = !preference.matches && saved !== 'off';
  const running = new Set();
  const control = document.createElement('button');
  control.className = 'motion-control';
  control.type = 'button';
  const sync = () => {
    root.dataset.motion = enabled ? 'on' : 'off';
    control.textContent = enabled ? 'Motion: on' : 'Motion: off';
    control.setAttribute('aria-label', enabled ? 'Turn off decorative animations' : 'Turn on decorative animations');
    control.setAttribute('aria-pressed', String(enabled));
    if (!enabled) {
      running.forEach(animation => animation.cancel());
      document.querySelectorAll('.project-card').forEach(card => card.style.removeProperty('transform'));
    }
  };
  control.addEventListener('click', () => {
    enabled = !enabled;
    try { localStorage.setItem('portfolio-motion', enabled ? 'on' : 'off'); } catch (_) {}
    sync();
  });
  preference.addEventListener('change', event => { enabled = !event.matches; sync(); });
  document.body.append(control);
  sync();
  const atmosphere = document.createElement('div');
  atmosphere.className = 'atmosphere';
  atmosphere.setAttribute('aria-hidden', 'true');
  document.querySelector('.hero')?.append(atmosphere);

  const animate = (element, frames, options) => {
    if (!enabled) return;
    const animation = element.animate(frames, options);
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  };
  // Animate children only when their section enters view; no hidden fallback content.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const items = entry.target.querySelectorAll('.project-card,.cert-list li,.power,.identity-facts article,.account-card');
      items.forEach((item, index) => animate(item,
        [{ opacity: 0, translate: '0 24px' }, { opacity: 1, translate: '0 0' }],
        { duration: 750, delay: Math.min(index * 70, 350), easing: 'cubic-bezier(.22,1,.36,1)' }));
    });
  }, { threshold: .06 });
  document.querySelectorAll('main > section:not(.hero)').forEach(section => observer.observe(section));

  const counters = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counters.unobserve(entry.target);
      const element = entry.target;
      const original = element.textContent;
      const target = parseInt(original, 10);
      if (!enabled || !Number.isFinite(target)) return;
      element.setAttribute('aria-label', original);
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / 1100, 1);
        element.textContent = enabled && progress < 1
          ? String(Math.round(target * (1 - (1 - progress) ** 3))).padStart(original.match(/^\d+/)[0].length, '0') + original.replace(/^\d+/, '')
          : original;
        if (enabled && progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .8 });
  document.querySelectorAll('.stat-num').forEach(element => counters.observe(element));
})();
