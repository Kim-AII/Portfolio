// === Menu hamburger (inchangé) ===
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', !isOpen);
  toggle.classList.toggle('is-open');
  nav.classList.toggle('is-open');
});


// === Animation du fond du hero (trame de points) ===

const canvas = document.querySelector('.hero__canvas');
const ctx = canvas.getContext('2d');

let mouse = { x: -1000, y: -1000 };
const spacing = 24;
const maxDistance = 150;

// NOUVEAU : liste des ondes envoyées par le circuit, partagée avec drawSensor()
let waves = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < canvas.width; x += spacing) {
    for (let y = 0; y < canvas.height; y += spacing) {

      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - distance / maxDistance);

      // NOUVEAU : est-ce qu'une onde du circuit passe actuellement par ce point ?
      let waveInfluence = 0;
      waves.forEach((wave) => {
        const wdx = x - wave.x;
        const wdy = y - wave.y;
        const distToWave = Math.sqrt(wdx * wdx + wdy * wdy);
        const bandWidth = 30;
        const distFromRing = Math.abs(distToWave - wave.radius);
        if (distFromRing < bandWidth) {
          const strength = (1 - distFromRing / bandWidth) * wave.opacity;
          waveInfluence = Math.max(waveInfluence, strength);
        }
      });

      const radius = 1 + influence * 3 + waveInfluence * 3;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = waveInfluence > 0
        ? `rgba(94, 234, 212, ${0.5 + waveInfluence * 0.5})`
        : '#8890A0';
      ctx.fill();
    }
  }

  // NOUVEAU : fait grandir et disparaître chaque onde active
  waves.forEach((wave) => {
    wave.radius += 6;
    wave.opacity = 1 - wave.radius / Math.max(canvas.width, canvas.height);
  });
  waves = waves.filter((wave) => wave.opacity > 0);

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

resize();
if (prefersReducedMotion) {
  draw();
} else {
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  draw();
}


// === Circuit néon animé (remplace l'ancien capteur) ===

const sensorCanvas = document.querySelector('.hero__sensor');
const sctx = sensorCanvas.getContext('2d');

function resizeSensor() {
  sensorCanvas.width = sensorCanvas.clientWidth;
  sensorCanvas.height = sensorCanvas.clientHeight;
}

const centerX = () => sensorCanvas.width / 2;
const centerY = () => sensorCanvas.height / 2;

let frameCount = 0;
let peakTriggered = false;

function drawSensor() {
  sctx.clearRect(0, 0, sensorCanvas.width, sensorCanvas.height);

  const autoPulse = (Math.sin(frameCount * 0.05) + 1) / 2;

  const rect = sensorCanvas.getBoundingClientRect();
  const sensorPageX = rect.left + rect.width / 2;
  const sensorPageY = rect.top + rect.height / 2;
  const dx = mouse.x - sensorPageX;
  const dy = mouse.y - sensorPageY;
  const distToMouse = Math.sqrt(dx * dx + dy * dy);
  const mouseInfluence = Math.max(0, 1 - distToMouse / 300);

  const intensity = Math.min(1, autoPulse * 0.6 + mouseInfluence * 0.7);
  const jitter = () => (Math.random() - 0.5) * intensity * 3;

  const traces = [
    { x1: -50, y1: 0,   x2: -20, y2: 0   },
    { x1: -20, y1: 0,   x2: -20, y2: -30 },
    { x1: -20, y1: -30, x2: 20,  y2: -30 },
    { x1: 20,  y1: 0,   x2: 50,  y2: 0   },
    { x1: 20,  y1: 0,   x2: 20,  y2: 30  },
    { x1: 20,  y1: 30,  x2: -20, y2: 30  },
  ];

  sctx.save();
  sctx.translate(centerX(), centerY());

  sctx.strokeStyle = '#5EEAD4';
  sctx.lineWidth = 2;
  sctx.shadowColor = '#5EEAD4';
  sctx.shadowBlur = 6 + intensity * 14;

  traces.forEach((t) => {
    sctx.beginPath();
    sctx.moveTo(t.x1 + jitter(), t.y1 + jitter());
    sctx.lineTo(t.x2 + jitter(), t.y2 + jitter());
    sctx.stroke();
  });

  sctx.fillStyle = '#E8871E';
  sctx.shadowColor = '#E8871E';
  [{ x: -50, y: 0 }, { x: 20, y: -30 }, { x: 50, y: 0 }, { x: -20, y: 30 }].forEach((n) => {
    sctx.beginPath();
    sctx.arc(n.x, n.y, 3 + intensity * 2, 0, Math.PI * 2);
    sctx.fill();
  });

  sctx.restore();

  if (autoPulse > 0.98 && !peakTriggered) {
    waves.push({ x: sensorPageX, y: sensorPageY, radius: 0, opacity: 1 });
    peakTriggered = true;
  }
  if (autoPulse < 0.5) {
    peakTriggered = false;
  }

  frameCount++;
  requestAnimationFrame(drawSensor);
}

resizeSensor();
drawSensor(); 