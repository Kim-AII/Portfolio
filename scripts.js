// ============================================
// Menu hamburger (toutes les pages)
// ============================================
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

function closeNav() {
  if (!toggle || !nav) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.classList.remove('is-open');
  nav.classList.remove('is-open');
}

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}


// ============================================
// Animations reveal au scroll
// ============================================
const revealSelectors = [
  '.presentation__visual',
  '.presentation__text',
  '.projets__cta-content',
  '.parcours__title',
  '.parcours__timeline',
  '.parcours__strengths',
  '.competences__title',
  '.competences__item',
  '.contact__intro-block',
  '.contact__columns',
  '.projets-page__card',
  '.site-footer__top',
  '.site-footer__bottom'
];

const revealElements = document.querySelectorAll(revealSelectors.join(', '));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealElements.length > 0) {
  revealElements.forEach((el) => el.classList.add('reveal'));

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }
}


// ============================================
// Retour en haut de page (toutes les pages)
// ============================================
const backToTop = document.querySelector('.site-footer__back-to-top');

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ============================================
// Effet machine à écrire du titre du hero (index.html uniquement)
// ============================================
function typewriter(el, text, speed = 60) {
  let i = 0;
  el.textContent = '';

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

const heroTitleVisible = document.querySelector('.hero__title-visible');
if (heroTitleVisible) {
  const prefersReducedMotionTyping = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotionTyping) {
    heroTitleVisible.textContent = 'Développeur & Designer.';
  } else {
    typewriter(heroTitleVisible, 'Développeur & Designer.');
  }
}


// ============================================
// Fond en trame de points, réutilisable (index.html uniquement)
// ============================================
function initDotGrid(canvasEl, waves = null) {
  const ctx = canvasEl.getContext('2d');
  let mouse = { x: -1000, y: -1000 };
  let isActive = true;
  let animationId = null;
  const spacing = 24;
  const maxDistance = 150;

  function resize() {
    canvasEl.width = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;
  }

  function draw() {
    if (!isActive) return;

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

    animationId = requestAnimationFrame(draw);
  }

  function start() {
    if (isActive) return;
    isActive = true;
    draw();
  }

  function stop() {
    isActive = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  window.addEventListener('resize', resize);

  const rect = () => canvasEl.getBoundingClientRect();
  window.addEventListener('mousemove', (e) => {
    if (!isActive) return;
    const r = rect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  if (!prefersReducedMotion) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(canvasEl);
  }

  resize();
  if (!prefersReducedMotion) draw();
}

const heroWaves = [];

const heroCanvas = document.querySelector('.hero__canvas');
if (heroCanvas) {
  initDotGrid(heroCanvas, heroWaves);
}

const projetsCanvas = document.querySelector('.projets__canvas');
if (projetsCanvas) {
  initDotGrid(projetsCanvas, null);
}


// ============================================
// Circuit néon animé du hero (index.html uniquement)
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
// Données des projets (projets.html uniquement, mais déclaré ici sans risque)
// ============================================
const projectsData = {
  mentorlink: {
    eyebrow: "Projet intégrateur — PIL1 2025/2026",
    title: "IFRI_MentorLink",
    tagline: "Une plateforme web qui met en relation étudiants et mentors au sein de l'IFRI.",
    tags: ["Flask", "MySQL", "HTML/CSS/JS", "Bootstrap"],
    context: "À l'IFRI, l'entraide entre étudiants existe déjà, mais reste informelle. [Développe le contexte ici]",
    problem: "[Quel problème précis ce projet résout-il ? Quelles étaient les contraintes de départ ?]",
    approach: "[Comment as-tu abordé le problème ? Quelles étapes as-tu suivies, seul ou en équipe ?]",
    technicalChoices: "[Pourquoi Flask plutôt qu'autre chose ? Pourquoi cet algorithme de matching pondéré ?]",
    difficulties: "[Qu'est-ce qui a été le plus dur ? Un bug tenace, une contrainte de temps ?]",
    result: "[Qu'est-ce que le projet a produit concrètement ? Note, retour du jury, ce que tu as appris ?]",
    role: [
      "Développement backend et frontend au sein d'une équipe",
      "Algorithme de matching pondéré, authentification, messagerie par polling",
      "Préparation approfondie de la soutenance orale"
    ],
    stack: ["Python / Flask", "MySQL", "HTML5", "CSS3", "JavaScript", "Bootstrap"],
    process: [
      { type: "sketch", caption: "Croquis initial de l'algorithme de matching", src: null },
      { type: "figma", caption: "Maquette Figma — page de profil", src: null },
      { type: "architecture", caption: "Schéma d'architecture backend", src: null },
      { type: "github", caption: "Capture du dépôt GitHub", src: null }
    ],
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
    problem: "[Quelle difficulté précise pose la reproduction fidèle d'un site institutionnel complexe ?]",
    approach: "[Comment as-tu découpé le travail ? Analyse du site source, wireframes, intégration ?]",
    technicalChoices: "[Pourquoi la méthodologie BEM ici en particulier ?]",
    difficulties: "[Qu'est-ce qui a été le plus dur à reproduire fidèlement ?]",
    result: "[Résultat final : fidélité, responsive, ce que ça a démontré de tes compétences ?]",
    role: [
      "Développement front-end complet",
      "Architecture CSS avec méthodologie BEM pour une structure maintenable"
    ],
    stack: ["HTML5", "CSS3 (BEM)"],
    process: [
      { type: "sketch", caption: "Analyse de la structure du site source", src: null },
      { type: "architecture", caption: "Plan de la nomenclature BEM", src: null }
    ],
    links: [{ label: "Voir la démo", url: "#" }]
  },

  coach: {
    eyebrow: "Projet personnel",
    title: "Landing Page Coach Sportif",
    tagline: "Une landing page complète en français pour un coach sportif, de la conception à l'intégration.",
    tags: ["HTML", "CSS", "Design"],
    context: "Créer une page de conversion efficace pour un coach sportif, avec un système de design pensé pour l'énergie et l'action.",
    problem: "[Quel était l'objectif de conversion précis ? Quelle contrainte de départ ?]",
    approach: "[Comment as-tu conçu le parcours visiteur ? Wireframe, choix de palette, hiérarchie visuelle ?]",
    technicalChoices: "[Pourquoi ce système dark/vert/orange ? Pourquoi cette structure de page ?]",
    difficulties: "[Qu'est-ce qui a été le plus dur à équilibrer visuellement ou techniquement ?]",
    result: "[Résultat : page livrée, retour éventuel, ce que tu as appris sur la conversion ?]",
    role: [
      "Design du système visuel dark/vert/orange",
      "Intégration HTML/CSS complète, pensée pour la conversion"
    ],
    stack: ["HTML5", "CSS3"],
    process: [
      { type: "sketch", caption: "Wireframe initial", src: null },
      { type: "figma", caption: "Maquette du système de couleurs", src: null }
    ],
    links: [{ label: "Voir la démo", url: "#" }]
  },

  pir: {
    eyebrow: "Stage CodeAlpha — Smart Agriculture",
    title: "Capteur PIR + LED — Simulation IoT",
    tagline: "Simulation d'un système de détection de mouvement, pensée dans une logique smart agriculture / domotique.",
    tags: ["Arduino", "Tinkercad", "C/C++"],
    context: "Valider la logique de détection de mouvement avant un déploiement matériel réel, dans le cadre du stage IoT chez CodeAlpha.",
    problem: "[Quel problème concret la détection de mouvement résout-elle en smart agriculture ?]",
    approach: "[Comment as-tu conçu le circuit ? Étapes de prototypage sur Tinkercad ?]",
    technicalChoices: "[Pourquoi un PIR plutôt qu'un autre type de capteur ? Choix du microcontrôleur ?]",
    difficulties: "[Quel bug ou quelle contrainte matérielle as-tu dû déboguer ?]",
    result: "[Simulation validée, ce que ça a confirmé avant un déploiement réel ?]",
    role: [
      "Conception et prototypage sur Tinkercad",
      "Écriture et débogage du code Arduino associé"
    ],
    stack: ["Arduino", "Tinkercad", "C/C++ embarqué"],
    process: [
      { type: "sketch", caption: "Schéma du circuit PIR + LED", src: null },
      { type: "architecture", caption: "Diagramme de la logique de détection", src: null }
    ],
    links: [{ label: "Voir la simulation Tinkercad", url: "#" }]
  },

  mqtt: {
    eyebrow: "Stage CodeAlpha — Smart Agriculture",
    title: "IoT Data Pipeline (MQTT Simulation)",
    tagline: "Simulation d'un pipeline de données IoT utilisant le protocole MQTT.",
    tags: ["Python", "MQTT", "Mosquitto"],
    context: "Simuler la communication entre capteurs et serveur via MQTT, pour valider la logique avant un déploiement matériel.",
    problem: "[Quel problème de communication entre capteurs et serveur ce pipeline résout-il ?]",
    approach: "[Comment as-tu structuré les topics MQTT ? Étapes de mise en place du broker simulé ?]",
    technicalChoices: "[Pourquoi MQTT plutôt qu'un autre protocole ? Pourquoi Mosquitto ?]",
    difficulties: "[Quelle difficulté as-tu rencontrée dans la synchronisation pub/sub ?]",
    result: "[Pipeline validé, ce que ça a démontré avant un déploiement matériel réel ?]",
    role: [
      "Développement d'un broker MQTT simulé",
      "Scripts de publication et de souscription aux topics",
      "Visualisation des données reçues"
    ],
    stack: ["Python", "MQTT", "Mosquitto"],
    process: [
      { type: "architecture", caption: "Schéma du pipeline de données", src: null },
      { type: "github", caption: "Capture du dépôt GitHub", src: null }
    ],
    links: [{ label: "Voir le dépôt GitHub", url: "#" }]
  }
};


// ============================================
// Galerie de projets + overlay de détail + lightbox (projets.html uniquement)
// ============================================
const overlay = document.getElementById('project-overlay');
const overlayContent = document.getElementById('project-overlay-content');
const closeBtn = document.querySelector('.project-overlay__close');
const cards = document.querySelectorAll('.projets-page__card');

const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxClose = document.querySelector('.lightbox__close');

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
        <h3>Le problème</h3>
        <p>${data.problem}</p>
      </div>

      <div class="project-overlay__section">
        <h3>Ma démarche</h3>
        <p>${data.approach}</p>
      </div>

      <div class="project-overlay__section">
        <h3>Choix techniques</h3>
        <p>${data.technicalChoices}</p>
      </div>

      <div class="project-overlay__section">
        <h3>Difficultés surmontées</h3>
        <p>${data.difficulties}</p>
      </div>

      <div class="project-overlay__section">
        <h3>Résultat</h3>
        <p>${data.result}</p>
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

      <div class="project-overlay__section">
        <h3>Le processus</h3>
        <div class="project-overlay__process">
          ${data.process.map((p, index) => `
            <button class="project-overlay__thumb" data-process-index="${index}" data-project-id="${id}">
              ${p.src
                ? `<img src="${p.src}" alt="${p.caption}">`
                : `<span class="project-overlay__thumb-placeholder">${p.type}</span>`
              }
              <span class="project-overlay__thumb-caption">${p.caption}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="project-overlay__links">
        ${data.links.map(l => `<a href="${l.url}">${l.label} &#8599;</a>`).join('')}
      </div>
    `;

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeProject() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openProject(card.dataset.project));
  });

  closeBtn.addEventListener('click', closeProject);

  function openLightbox(projectId, index) {
    const item = projectsData[projectId].process[index];
    lightboxContent.innerHTML = `
      ${item.src
        ? `<img src="${item.src}" alt="${item.caption}">`
        : `<div class="lightbox__placeholder">${item.type}</div>`
      }
      <p class="lightbox__caption">${item.caption}</p>
    `;
    lightbox.classList.add('is-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
  }

  // Délégation d'événements : on écoute le conteneur stable, pas les vignettes
  // (qui n'existent qu'après l'ouverture d'un projet, donc pas au chargement de la page)
  overlayContent.addEventListener('click', (e) => {
    const thumb = e.target.closest('.project-overlay__thumb');
    if (thumb) {
      openLightbox(thumb.dataset.projectId, thumb.dataset.processIndex);
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeProject();
    }
  });
}