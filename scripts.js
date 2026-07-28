const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', !isOpen);
  toggle.classList.toggle('is-open');
  nav.classList.toggle('is-open');
});

const canvas = document.querySelector('.hero__canvas');
const ctx = canvas.getContext('2d');

// Position de la souris — hors écran par défaut, pour que rien ne réagisse au chargement
let mouse = { x: -1000, y: -1000 };

// Espacement entre les points, et distance d'influence de la souris
const spacing = 24;
const maxDistance = 150;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function draw() {
  // On efface tout le canvas avant de redessiner (sinon les points s'accumulent)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // On parcourt l'écran par pas de "spacing" pixels, en x puis en y
  for (let x = 0; x < canvas.width; x += spacing) {
    for (let y = 0; y < canvas.height; y += spacing) {

      // Distance entre ce point (x, y) et la souris — théorème de Pythagore
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // "influence" vaut 1 quand la souris est pile sur le point, 0 au-delà de maxDistance
      const influence = Math.max(0, 1 - distance / maxDistance);

      // Le rayon grossit avec l'influence : 1px au repos, jusqu'à 4px sous la souris
      const radius = 1 + influence * 3;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#8890A0'; // ta variable --color-graphite
      ctx.fill();
    }
  }

  requestAnimationFrame(draw); // relance draw() au prochain rafraîchissement d'écran
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Respecte les personnes sensibles aux animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

resize();
if (prefersReducedMotion) {
  draw(); // dessine une seule fois, sans boucle, sans réaction à la souris
} else {
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  draw();
}