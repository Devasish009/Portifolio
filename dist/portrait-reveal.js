'use strict';
(() => {
  const layer = document.querySelector('.portrait-layer');
  const photo = layer?.querySelector('.portrait-photo');
  if (!photo) return;
  window.revealPortrait = async () => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;
    try { await Promise.race([photo.decode(), new Promise(resolve => setTimeout(resolve, 1500))]); } catch (_) { return; }
    if (!photo.complete || !photo.naturalWidth) return;
    if (!document.documentElement.classList.contains('name-settling')) return;
    const bounds = layer.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const width = Math.min(1000, Math.round(bounds.width));
    const height = Math.round(width * bounds.height / bounds.width);
    const canvas = document.createElement('canvas');
    canvas.className = 'portrait-outline';
    canvas.setAttribute('aria-hidden', 'true');
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    // Precomputed source pixels also work for file:// previews, where canvas reads can be blocked.
    const data = window.__portraitParticles;
    if (!data) return;
    const scale = Math.max(width / data.width, height / data.height);
    const position = getComputedStyle(photo).objectPosition.split(' ');
    const cropY = parseFloat(position[1] || '50%') / 100;
    const left = (width - data.width * scale) / 2;
    const top = (height - data.height * scale) * cropY;
    const particles = data.points.flatMap(([sx, sy, edge, brightness], index) => {
      if (bounds.width < 600 && index % 2) return [];
      const x = left + sx * scale, y = top + sy * scale;
      return x < -5 || x > width + 5 || y < -5 || y > height + 5 ? []
        : [{ x, y, edge, brightness, seed: ((sx * 13.37 + sy * 7.91) % 101) / 101 }];
    });
    layer.querySelector('.portrait-outline')?.remove();
    layer.append(canvas);
    photo.classList.add('portrait-revealing');
    const start = performance.now();
    await new Promise(resolve => {
      const finish = () => { canvas.remove(); photo.classList.remove('portrait-revealing'); resolve(); };
      const render = now => {
        const t = Math.min((now - start) / 3200, 1);
        if (t >= 1 || document.hidden || reduced.matches || !document.documentElement.classList.contains('name-settling')) { finish(); return; }
        ctx.clearRect(0, 0, width, height);
        const fade = Math.min(1, t / .12) * (1 - Math.max(0, (t - .7) / .3));
        ctx.globalCompositeOperation = 'lighter';
        for (const p of particles) {
          // Embers drift into the face in a rising wave, then dissolve into the photo.
          const delay = (1 - p.y / height) * .24 + p.seed * .12;
          const progress = Math.max(0, Math.min(1, (t - delay) / .35));
          if (!progress) continue;
          const drift = (1 - progress) ** 3;
          const x = p.x + Math.sin(p.seed * 24 + t * 5) * width * .14 * drift;
          const y = p.y + height * .2 * drift;
          const alpha = fade * progress * (.35 + p.edge * .45 + p.brightness * .2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          const size = .9 + p.edge * .9;
          ctx.fillRect(x, y, size, size);
          if (p.edge > .55) {
            ctx.fillStyle = `rgba(255,255,255,${alpha * .07})`;
            ctx.fillRect(x - 2, y - 2, 5, 5);
          }
        }
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    });
  };
})();
