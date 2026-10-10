'use strict';
document.documentElement.classList.add('js');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// Animate one heading throughout: no duplicate splash text or handoff flash.
let introRunning = false;
async function introduceName(replay = false) {
  if (introRunning || (!replay && location.hash && location.hash !== '#home')) return;
  const root = document.documentElement;
  const title = document.querySelector('#hero-title');
  const initial = title.querySelector('.name-initial');
  const rest = title.querySelector('.name-rest');
  const animations = [];
  introRunning = true;
  root.classList.remove('name-arrived');
  const previousScrollBehavior = root.style.scrollBehavior;
  const previousScrollRestoration = history.scrollRestoration;
  history.scrollRestoration = 'manual';
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.classList.add('name-intro');
  title.style.visibility = 'hidden';
  rest.style.visibility = 'hidden';
  // Hand the first-paint black screen to the prepared name animation.
  root.classList.remove('intro-loading');
  const finish = () => {
    animations.forEach(animation => animation.cancel());
    title.style.removeProperty('visibility');
    rest.style.removeProperty('visibility');
    root.classList.remove('name-intro');
    root.classList.remove('name-settling');
    root.classList.add('name-arrived');
    root.style.scrollBehavior = previousScrollBehavior;
    history.scrollRestoration = previousScrollRestoration;
    introRunning = false;
  };
  const skip = () => finish();
  // Ignore incidental height changes (such as mobile browser chrome).
  const startingWidth = innerWidth;
  const resize = () => { if (Math.abs(innerWidth - startingWidth) > 40) skip(); };
  window.addEventListener('resize', resize);
  reducedMotion.addEventListener('change', skip, { once: true });
  const play = async (element, frames, options) => {
    const animation = element.animate(frames, { fill: 'both', ...options });
    animations.push(animation);
    await animation.finished;
  };
  try {
    // Bound font waiting so a slow network cannot hold the opening screen.
    await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 600))]);
    if (!root.classList.contains('name-intro')) return;
    const box = title.getBoundingClientRect();
    const d = initial.getBoundingClientRect();
    const scale = innerWidth < 600 ? .85 : .62;
    const dx = innerWidth / 2 - (box.left + box.width / 2);
    const dy = innerHeight / 2 - (box.top + box.height / 2);
    const centered = `translate(calc(-50% + ${dx}px), calc(-10% + ${dy}px)) scale(${scale})`;
    const monogram = `translate(calc(-50% + ${dx + (box.width - d.width) * scale / 2}px), calc(-10% + ${dy}px)) scale(${scale})`;
    title.style.removeProperty('visibility');
    if (reducedMotion.matches) {
      // Preserve the D-to-name sequence without spatial motion.
      await play(title, [{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
      rest.style.removeProperty('visibility');
      await play(rest, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 500 });

      return;
    }
    await play(title, [{ transform: monogram, opacity: 0 }, { transform: monogram, opacity: 1 }], { duration: 450, easing: 'ease-out' });
    rest.style.removeProperty('visibility');
    
    await Promise.all([
      play(title, [{ transform: monogram }, { transform: centered }], { duration: 1100, delay: 100, easing: 'cubic-bezier(.22,1,.36,1)' }),
      play(rest, [{ clipPath: 'inset(-20% 100% -20% 0)', transform: 'translateX(-.45em)', opacity: 0 }, { clipPath: 'inset(-20% -10% -20% 0)', transform: 'translateX(0)', opacity: 1 }], { duration: 1100, delay: 100, easing: 'cubic-bezier(.22,1,.36,1)' })
    ]);
    // Gently enlarge the revealed name into place; the portrait arrives near the end.
    root.classList.add('name-settling');
    await play(title, [{ transform: centered }, { transform: 'translate(-50%, -10%) scale(1)' }], { duration: 1600, easing: 'cubic-bezier(.45,0,.2,1)' });

  } catch (error) {
    // Cancellation (resize or motion preference changes) reveals the page immediately.
    if (error.name !== 'AbortError') console.warn('Name intro could not complete:', error);
  } finally {
    finish();
    window.removeEventListener('resize', resize);
    reducedMotion.removeEventListener('change', skip);
  }
}
introduceName();
const menu = document.querySelector('#menu');
const menuToggle = document.querySelector('.menu-toggle');
let menuClosing = null;
let menuOverflow = '';
function closeMenu() {
  if (!menu.open) return Promise.resolve();
  if (menuClosing) return menuClosing;
  const animation = reducedMotion.matches ? null : menu.animate([
    { opacity: 1, transform: 'translateY(0) scale(1)' },
    { opacity: 0, transform: 'translateY(-8px) scale(.98)' }
  ], { duration: 160, easing: 'ease-in', fill: 'forwards' });
  menuClosing = (animation ? animation.finished.catch(() => {}) : Promise.resolve()).then(() => {
    menu.close();
    if (animation) animation.cancel();
    menuClosing = null;
  });
  return menuClosing;
}
menuToggle.addEventListener('click', () => {
  if (menu.open) { closeMenu(); return; }
  menuOverflow = document.body.style.overflow;
  menu.showModal(); menuToggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden';
  if (!reducedMotion.matches) menu.animate([
    { opacity: 0, transform: 'translateY(-12px) scale(.97)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ], { duration: 260, easing: 'cubic-bezier(.16,1,.3,1)' });
});
menu.addEventListener('close', () => { menuToggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = menuOverflow; });
menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
menu.addEventListener('click', event => {
  const bounds = menu.getBoundingClientRect();
  if (event.target === menu && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeMenu();
});
document.querySelector('.close-menu').addEventListener('click', closeMenu);
const menuLinks = [...menu.querySelectorAll('nav a')];
menuLinks.forEach(link => link.addEventListener('click', async event => {
  event.preventDefault();
  await closeMenu();
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  history.pushState(null, '', link.getAttribute('href'));
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}));
const credits = document.querySelector('#credits');
document.querySelector('#credits-open').addEventListener('click', () => credits.showModal());
document.querySelector('#credits-close').addEventListener('click', () => credits.close());
document.querySelectorAll('.power').forEach(button => button.addEventListener('click', () => {
  const opening = button.getAttribute('aria-expanded') !== 'true';
  document.querySelectorAll('.power').forEach(item => {
    const active = item === button && opening;
    item.classList.toggle('active', active);
    item.setAttribute('aria-expanded', String(active));
    item.querySelector('.power-description').hidden = !active;
    item.querySelector('i').textContent = active ? '−' : '+';
  });
}));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .1 });
document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));
const panels = [...document.querySelectorAll('.panel')];
const dots = [...document.querySelectorAll('.section-dots a')];
const progress = document.querySelector('.progress');
let pending = false;
function updateScroll() {
  pending = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  document.documentElement.style.setProperty('--scroll', Math.min(scrollY / innerHeight, 1));
  let active = 0;
  panels.forEach((section, index) => { if (section.getBoundingClientRect().top < innerHeight * .5) active = index; });
  dots.forEach((dot, index) => index === active ? dot.setAttribute('aria-current', 'location') : dot.removeAttribute('aria-current'));
  menuLinks.forEach(link => link.getAttribute('href') === `#${panels[active].id}` ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
}
addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
addEventListener('resize', updateScroll);
updateScroll();
const hero = document.querySelector('.hero');
hero.addEventListener('pointermove', event => {
  if (reducedMotion.matches || event.pointerType !== 'mouse') return;
  document.documentElement.style.setProperty('--px', event.clientX / innerWidth * 2 - 1);
  document.documentElement.style.setProperty('--py', event.clientY / innerHeight * 2 - 1);
}, { passive: true });
hero.addEventListener('pointerleave', () => { document.documentElement.style.setProperty('--px', 0); document.documentElement.style.setProperty('--py', 0); });
// Draw decorative web strands as scalable paths, not bitmap backgrounds.
document.querySelectorAll('.web').forEach(svg => {
  const ns = 'http://www.w3.org/2000/svg';
  const cx = 70, cy = 90, spokes = 15, step = Math.PI * 2 / spokes;
  function path(d) { const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); svg.append(p); }
  for (let i = 0; i < spokes; i++) {
    const a = i * step; path(`M${cx},${cy} L${cx + Math.cos(a)*1100},${cy + Math.sin(a)*1100}`);
  }
  for (let r = 70; r < 1150; r += 65) {
    for (let i = 0; i < spokes; i++) {
      const a = i * step, b = (i+1)*step, mid = (a+b)/2;
      path(`M${cx+Math.cos(a)*r},${cy+Math.sin(a)*r} Q${cx+Math.cos(mid)*r*.89},${cy+Math.sin(mid)*r*.89} ${cx+Math.cos(b)*r},${cy+Math.sin(b)*r}`);
    }
  }
});
// Interactive 3D tilt & glare tracking for project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType !== 'mouse') return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = Math.max(-1, Math.min(1, (y - centerY) / centerY)) * -2;
    const rotateY = Math.max(-1, Math.min(1, (x - centerX) / centerX)) * 2;
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    card.style.setProperty('--gx', `${(x / rect.width * 100).toFixed(1)}%`);
    card.style.setProperty('--gy', `${(y / rect.height * 100).toFixed(1)}%`);
  }, { passive: true });
  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('transform');
  });
});
