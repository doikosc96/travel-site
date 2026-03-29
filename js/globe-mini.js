/*  Mini globe — renders a small spinning earth in #nav-globe-slot
    Requires Three.js (r128) loaded before this script.              */
(function () {
  const slot = document.getElementById('nav-globe-slot');
  if (!slot || typeof THREE === 'undefined') return;

  const SIZE = 32;
  const canvas = document.createElement('canvas');
  canvas.className = 'mini-globe-canvas';
  canvas.width  = SIZE * 2;
  canvas.height = SIZE * 2;
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  slot.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(SIZE, SIZE);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 2.85;

  // Earth
  const geo = new THREE.SphereGeometry(1, 48, 48);
  const mat = new THREE.MeshPhongMaterial({ color: 0x224466, specular: 0x0d2244, shininess: 20 });
  const earth = new THREE.Mesh(geo, mat);
  scene.add(earth);

  // Atmosphere
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.04, 24, 24),
    new THREE.MeshPhongMaterial({ color: 0x5577ff, transparent: true, opacity: 0.12, side: THREE.BackSide })
  ));

  // Lights
  scene.add(new THREE.AmbientLight(0x223355, 0.9));
  const sun = new THREE.DirectionalLight(0xfff8f0, 1.75);
  sun.position.set(5, 2, 4);
  scene.add(sun);

  // Texture
  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';

  function fallback() {
    const fc = document.createElement('canvas');
    fc.width = 512; fc.height = 256;
    const ctx = fc.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#0d2a55');
    g.addColorStop(0.5, '#1a4a88');
    g.addColorStop(1, '#0d2a55');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#2a6e3a';
    [[50,45,60,55],[65,35,30,40],[110,25,85,70],[195,30,25,30],
     [215,50,140,95],[360,45,135,100],[425,45,50,65]].forEach(([cx,cy,rw,rh]) => {
      ctx.beginPath(); ctx.ellipse(cx, cy, rw/2, rh/2, 0, 0, Math.PI*2); ctx.fill();
    });
    mat.map = new THREE.CanvasTexture(fc);
    mat.color.set(0xffffff);
    mat.needsUpdate = true;
  }

  loader.load(
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    t => { mat.map = t; mat.color.set(0xffffff); mat.needsUpdate = true; },
    undefined,
    fallback
  );

  // Animate
  (function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.0012;
    renderer.render(scene, camera);
  })();
})();
