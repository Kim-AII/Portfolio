// ============================================
// Menu hamburger (présent sur toutes les pages)
// ============================================
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isOpen);
    toggle.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });

  // Fermer le nav si on clique sur un lien
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-open');
      nav.classList.remove('is-open');
    });
  });
}


// ============================================
// Fond en trame de points, réutilisable
// ============================================
function initDotGrid(canvasEl, waves = null) {
  const ctx = canvasEl.getContext('2d');
  let mouse = { x: -1000, y: -1000 };
  const spacing = 24;
  const maxDistance = 150;

  function resize() {
    canvasEl.width = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    for (let x = 0; x < canvasEl.width; x += spacing) {
      for (let y = 0; y < canvasEl.height; y += spacing) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / maxDistance);

        let waveInfluence = 0;
        if (waves) {
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
        }

        const radius = 1 + influence * 3 + waveInfluence * 3;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = waveInfluence > 0
          ? `rgba(94, 234, 212, ${0.5 + waveInfluence * 0.5})`
          : '#8890A0';
        ctx.fill();
      }
    }

    if (waves) {
      waves.forEach((wave) => {
        wave.radius += 6;
        wave.opacity = 1 - wave.radius / Math.max(canvasEl.width, canvasEl.height);
      });
      for (let i = waves.length - 1; i >= 0; i--) {
        if (waves[i].opacity <= 0) waves.splice(i, 1);
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);

  const rect = () => canvasEl.getBoundingClientRect();
  window.addEventListener('mousemove', (e) => {
    const r = rect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  resize();
  draw();
}

// Le fond du hero reçoit un tableau d'ondes partagé avec son circuit néon
// heroWaves est déclaré au niveau module pour être accessible partout
const heroWaves = [];

const heroCanvas = document.querySelector('.hero__canvas');
if (heroCanvas) {
  initDotGrid(heroCanvas, heroWaves);
}

// Le fond de la section Projets (page d'accueil) n'a pas d'ondes
const projetsCanvas = document.querySelector('.projets__canvas');
if (projetsCanvas) {
  initDotGrid(projetsCanvas, null);
}


// ============================================
// Circuit néon animé du hero (uniquement sur index.html)
// ============================================
const sensorCanvas = document.querySelector('.hero__sensor');

if (sensorCanvas) {
  const sctx = sensorCanvas.getContext('2d');

  function resizeSensor() {
    sensorCanvas.width = sensorCanvas.clientWidth;
    sensorCanvas.height = sensorCanvas.clientHeight;
  }

  const centerX = () => sensorCanvas.width / 2;
  const centerY = () => sensorCanvas.height / 2;

  let sensorFrameCount = 0;
  let peakTriggered = false;
  let sensorMouse = { x: -1000, y: -1000 };

  window.addEventListener('mousemove', (e) => {
    sensorMouse.x = e.clientX;
    sensorMouse.y = e.clientY;
  });

  window.addEventListener('resize', resizeSensor);

  function drawSensor() {
    sctx.clearRect(0, 0, sensorCanvas.width, sensorCanvas.height);

    const autoPulse = (Math.sin(sensorFrameCount * 0.05) + 1) / 2;

    const rect = sensorCanvas.getBoundingClientRect();
    const sensorPageX = rect.left + rect.width / 2;
    const sensorPageY = rect.top + rect.height / 2;
    const dx = sensorMouse.x - sensorPageX;
    const dy = sensorMouse.y - sensorPageY;
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
      heroWaves.push({ x: sensorPageX, y: sensorPageY, radius: 0, opacity: 1 });
      peakTriggered = true;
    }
    if (autoPulse < 0.5) {
      peakTriggered = false;
    }

    sensorFrameCount++;
    requestAnimationFrame(drawSensor);
  }

  resizeSensor();
  drawSensor();
}


// ============================================
// Galerie de projets + overlay de détail (uniquement sur projet.html)
// ============================================
const projectsData = {
  mentorlink: {
    eyebrow: "Projet intégrateur — PIL1 2025/2026",
    title: "IFRI_MentorLink",
    tagline: "Une plateforme web qui met en relation étudiants et mentors au sein de l'IFRI.",
    tags: ["Flask", "MySQL", "HTML/CSS/JS", "Bootstrap"],
    context: "À l'IFRI, l'entraide entre étudiants existe déjà, mais reste informelle. Les étudiants en difficulté ne savent pas toujours vers qui se tourner.",
    role: [
      "Développement backend et frontend au sein d'une équipe",
      "Algorithme de matching pondéré, authentification, messagerie par polling",
      "Préparation approfondie de la soutenance orale"
    ],
    stack: ["Python / Flask", "MySQL", "HTML5", "CSS3", "JavaScript", "Bootstrap"],
    links: [
      { label: "Voir le code", url: "#" },
      { label: "Voir la démo", url: "#" }
    ]
  },
  presidence: {
    eyebrow: "Exercice de style front-end",
    title: "Mockup Présidence.bj",
    tagline: "Refonte visuelle et structurelle d'un site institutionnel.",
    tags: ["HTML", "CSS", "BEM"],
    context: "Exercice sur la rigueur d'un design gouvernemental — reproduire fidèlement un site institutionnel complexe.",
    role: [
      "Développement front-end complet",
      "Architecture CSS avec méthodologie BEM pour une structure maintenable"
    ],
    stack: ["HTML5", "CSS3 (BEM)"],
    links: [{ label: "Voir la démo", url: "#" }]
  },
  coach: {
    eyebrow: "Projet personnel",
    title: "Landing Page Coach Sportif",
    tagline: "Une landing page complète en français pour un coach sportif, de la conception à l'intégration.",
    tags: ["HTML", "CSS", "Design"],
    context: "Créer une page de conversion efficace pour un coach sportif, avec un système de design pensé pour l'énergie et l'action.",
    role: [
      "Design du système visuel dark/vert/orange",
      "Intégration HTML/CSS complète, pensée pour la conversion"
    ],
    stack: ["HTML5", "CSS3"],
    links: [{ label: "Voir la démo", url: "#" }]
  },
  pir: {
    eyebrow: "Stage CodeAlpha — Smart Agriculture",
    title: "Capteur PIR + LED — Simulation IoT",
    tagline: "Simulation d'un système de détection de mouvement, pensée dans une logique smart agriculture / domotique.",
    tags: ["Arduino", "Tinkercad", "C/C++"],
    context: "Valider la logique de détection de mouvement avant un déploiement matériel réel, dans le cadre du stage IoT chez CodeAlpha.",
    role: [
      "Conception et prototypage sur Tinkercad",
      "Écriture et débogage du code Arduino associé"
    ],
    stack: ["Arduino", "Tinkercad", "C/C++ embarqué"],
    links: [{ label: "Voir la simulation Tinkercad", url: "#" }]
  },
  mqtt: {
    eyebrow: "Stage CodeAlpha — Smart Agriculture",
    title: "IoT Data Pipeline (MQTT Simulation)",
    tagline: "Simulation d'un pipeline de données IoT utilisant le protocole MQTT.",
    tags: ["Python", "MQTT", "Mosquitto"],
    context: "Simuler la communication entre capteurs et serveur via MQTT, pour valider la logique avant un déploiement matériel.",
    role: [
      "Développement d'un broker MQTT simulé",
      "Scripts de publication et de souscription aux topics",
      "Visualisation des données reçues"
    ],
    stack: ["Python", "MQTT", "Mosquitto"],
    links: [{ label: "Voir le dépôt GitHub", url: "#" }]
  }
};

const overlay = document.getElementById('project-overlay');
const overlayContent = document.getElementById('project-overlay-content');
const closeBtn = document.querySelector('.project-overlay__close');
const cards = document.querySelectorAll('.projets-page__card');

if (overlay && overlayContent && closeBtn && cards.length > 0) {

  function openProject(id) {
    const data = projectsData[id];
    if (!data) return;

    overlayContent.innerHTML = `
      <p class="project-overlay__eyebrow">${data.eyebrow}</p>
      <h2 class="project-overlay__title">${data.title}</h2>
      <p class="project-overlay__tagline">${data.tagline}</p>

      <div class="project-overlay__tags">
        ${data.tags.map(tag => `<span>${tag}</span>`).join('')}
      </div>

      <div class="project-overlay__section">
        <h3>Le contexte</h3>
        <p>${data.context}</p>
      </div>

      <div class="project-overlay__section">
        <h3>Mon rôle</h3>
        <ul>${data.role.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>

      <div class="project-overlay__section">
        <h3>Stack technique</h3>
        <div class="project-overlay__stack">
          ${data.stack.map(s => `<span>${s}</span>`).join('')}
        </div>
      </div>

      <div class="project-overlay__links">
        ${data.links.map(l => `<a href="${l.url}">${l.label} &#8599;</a>`).join('')}
      </div>
    `;

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProject() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openProject(card.dataset.project));
  });

  closeBtn.addEventListener('click', closeProject);

  // Fermer en cliquant sur le fond de l'overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeProject();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProject();
  });
}


// ============================================
// Animation d'apparition au scroll (toutes les pages)
// ============================================
const revealEls = document.querySelectorAll(
  '.parcours__strength, .competences__item, .projets-page__card, .contact__form'
);

if (revealEls.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

const backToTop = document.querySelector('.site-footer__back-to-top');

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}