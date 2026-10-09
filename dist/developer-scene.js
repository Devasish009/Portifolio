'use strict';
(() => {
  const host = document.querySelector('#developer-viewport');
  if (!host) return;
  const status = host.querySelector('.scene-status');
  const spin = document.querySelector('#scene-spin');
  const reset = document.querySelector('#scene-reset');
  const zoomIn = document.querySelector('#scene-zoom-in');
  const zoomOut = document.querySelector('#scene-zoom-out');
  const buttons = [spin, reset, zoomIn, zoomOut];
  buttons.forEach(button => { button.disabled = true; });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const T = window.THREE;
  let renderer, scene, camera, model, frame = 0, lastTime = 0;
  let loading = false, loaded = false, visible = false, lost = false;
  let yaw = .65, elevation = .22, zoom = 1, spinning = !motion.matches;
  let pointer = null, lastX = 0, lastY = 0, resumeAt = 0, radius = 2;
  const target = { x: 0, y: 1.5, z: 0 };
  function updateSpin() {
    spin.textContent = spinning ? 'Pause rotation' : 'Start rotation';
    spin.setAttribute('aria-pressed', String(spinning));
  }
  updateSpin();
  function canDraw() { return loaded && visible && !document.hidden && !lost; }
  function stop() { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  function wake() { if (canDraw() && !frame) frame = requestAnimationFrame(draw); }
  function draw(time) {
    frame = 0;
    if (!canDraw()) return;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, .04) : 0;
    lastTime = time;
    if (spinning && pointer === null && time > resumeAt) yaw += delta * .12;
    const vertical = T.MathUtils.degToRad(camera.fov) / 2;
    const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
    const distance = radius / Math.sin(Math.min(vertical, horizontal)) * 1.02 / zoom;
    camera.position.set(target.x + Math.sin(yaw) * Math.cos(elevation) * distance, target.y + Math.sin(elevation) * distance, target.z + Math.cos(yaw) * Math.cos(elevation) * distance);
    camera.lookAt(target.x, target.y, target.z);
    renderer.render(scene, camera);
    if (spinning || pointer !== null) wake();
  }
  function resize() {
    if (!renderer || !camera) return;
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); wake();
  }
  function fail(message) {
    stop(); loading = false;
    status.hidden = false; status.classList.add('scene-error'); status.textContent = message;
    host.setAttribute('aria-busy', 'false');
    buttons.forEach(button => { button.disabled = true; });
  }
  async function readModel() {
    if (location.protocol === 'file:') {
      // Classic scripts work in directly opened HTML, where fetch() is blocked.
      const script = document.createElement('script');
      script.src = 'assets/developer-workspace-local.js?v=1';
      await new Promise((resolve, reject) => {
        script.onload = resolve; script.onerror = () => reject(new Error('Local model asset could not load'));
        document.head.append(script);
      });
      const encoded = window.__developerModelPayload;
      delete window.__developerModelPayload; script.remove();
      if (!encoded || !window.DecompressionStream) throw new Error('Open this website through its local server to view the model.');
      const data = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
      return new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    }
    const response = await fetch('assets/developer-workspace.glb');
    if (!response.ok) throw new Error('Model download failed. Refresh to retry.');
    return response.arrayBuffer();
  }
  async function load() {
    if (loading || loaded) return;
    loading = true; host.setAttribute('aria-busy', 'true'); status.textContent = 'Loading your 3D workspace…';
    try {
      if (!T || !window.GLTFLoader) throw new Error('3D viewer could not load. Refresh to retry.');
      renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
      scene = new T.Scene(); camera = new T.PerspectiveCamera(36, 1, .05, 100);
      // Neutral studio lights preserve natural black hair and the skin colors.
      scene.add(new T.HemisphereLight(0xf3f5ff, 0x46444a, 2.15));
      const key = new T.DirectionalLight(0xfff6ee, 2.2); key.position.set(4, 6, 5); scene.add(key);
      const fill = new T.DirectionalLight(0xdde9ff, 1.35); fill.position.set(-4, 3, -2); scene.add(fill);
      const rim = new T.DirectionalLight(0xffffff, .85); rim.position.set(0, 5, -5); scene.add(rim);
      const bytes = await readModel(); status.textContent = 'Preparing the model…';
      const gltf = await new Promise((resolve, reject) => new window.GLTFLoader().parse(bytes, '', resolve, reject));
      model = gltf.scene;
      model.traverse(object => {
        if (!object.isMesh) return;
        if (!object.geometry.attributes.normal) object.geometry.computeVertexNormals();
        for (const material of (Array.isArray(object.material) ? object.material : [object.material])) {
          material.flatShading = false; material.metalness = 0; material.roughness = .88; material.needsUpdate = true;
        }
      });
      let bounds = new T.Box3().setFromObject(model);
      model.scale.setScalar(3 / bounds.getSize(new T.Vector3()).y);
      bounds = new T.Box3().setFromObject(model);
      const center = bounds.getCenter(new T.Vector3());
      model.position.sub(new T.Vector3(center.x, bounds.min.y, center.z)); scene.add(model);
      bounds = new T.Box3().setFromObject(model);
      radius = bounds.getBoundingSphere(new T.Sphere()).radius;
      target.y = (bounds.max.y - bounds.min.y) / 2;
      // A soft contact shadow avoids a second expensive render of the dense mesh.
      const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
      const ctx = shadowCanvas.getContext('2d');
      const gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0,0,0,.55)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
      const shadow = new T.Mesh(new T.PlaneGeometry(4.5, 3.5), new T.MeshBasicMaterial({ map: new T.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.015; scene.add(shadow);
      host.append(renderer.domElement); renderer.domElement.setAttribute('aria-hidden', 'true');
      loaded = true; loading = false; status.hidden = true; host.setAttribute('aria-busy', 'false');
      buttons.forEach(button => { button.disabled = false; });
      resumeAt = performance.now() + 2200; resize(); wake();
      renderer.domElement.addEventListener('webglcontextlost', event => {
        event.preventDefault(); lost = true; fail('3D view paused by your browser. Refresh to reload.');
      });
    } catch (error) {
      if (renderer) { renderer.dispose(); renderer = null; }
      fail(error.message || '3D preview unavailable. Refresh to retry.');
    }
  }
  spin.addEventListener('click', () => { spinning = !spinning; updateSpin(); wake(); });
  reset.addEventListener('click', () => { yaw = .65; elevation = .22; zoom = 1; resumeAt = performance.now() + 2500; wake(); });
  function setZoom(amount) { zoom = T.MathUtils.clamp(zoom + amount, .8, 1.6); wake(); }
  zoomIn.addEventListener('click', () => setZoom(.15)); zoomOut.addEventListener('click', () => setZoom(-.15));
  motion.addEventListener('change', () => { spinning = !motion.matches; updateSpin(); wake(); });
  host.addEventListener('pointerdown', event => {
    if (!loaded || lost || event.button !== 0 || pointer !== null) return;
    pointer = event.pointerId; lastX = event.clientX; lastY = event.clientY;
    host.setPointerCapture(pointer); host.focus({ preventScroll: true }); wake();
  });
  host.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    yaw -= (event.clientX - lastX) * .008;
    elevation = T.MathUtils.clamp(elevation + (event.clientY - lastY) * .003, .04, .8);
    lastX = event.clientX; lastY = event.clientY; wake();
  });
  function release() { pointer = null; resumeAt = performance.now() + 3000; wake(); }
  host.addEventListener('pointerup', release); host.addEventListener('pointercancel', release); host.addEventListener('lostpointercapture', release);
  host.addEventListener('keydown', event => {
    if (!loaded || lost || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', '=', 'Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') yaw -= .15;
    if (event.key === 'ArrowRight') yaw += .15;
    if (event.key === 'ArrowUp') elevation = Math.min(.8, elevation + .07);
    if (event.key === 'ArrowDown') elevation = Math.max(.04, elevation - .07);
    if (event.key === '+' || event.key === '=') setZoom(.15);
    if (event.key === '-') setZoom(-.15);
    if (event.key === 'Home') { yaw = .65; elevation = .22; zoom = 1; }
    resumeAt = performance.now() + 3000; wake();
  });
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) { load(); wake(); } else stop();
  }, { rootMargin: '250px' }).observe(host);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : wake());
})();
