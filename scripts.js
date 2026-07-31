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

  context: "À l'IFRI, l'entraide entre étudiants existe déjà, mais reste informelle. Elle passe par des groupes WhatsApp dispersés, du bouche-à-oreille ou des rencontres au hasard des couloirs — sans réelle structure ni suivi. Un étudiant en difficulté sur une matière n'a souvent aucun moyen simple de savoir qui, parmi ses pairs plus avancés, pourrait l'accompagner. IFRI_MentorLink est né de ce constat : donner un cadre digital à une entraide qui existait déjà, mais qui manquait d'outils pour être efficace et durable.",

  problem: "Comment mettre en relation, de manière fiable et automatisée, un étudiant qui a besoin d'aide sur une matière ou une compétence précise avec un mentor réellement compétent et disponible ? Le défi n'était pas seulement technique : il fallait concevoir un système de mise en relation pertinent (au-delà d'un simple annuaire), tout en respectant les contraintes d'un projet réalisé en équipe, dans un temps limité, avec des technologies à maîtriser rapidement.",

  approach: "Nous avons démarré par une phase de cadrage : lister les parcours utilisateurs clés (inscription, recherche de mentor, mise en relation, échange), puis modéliser la base de données autour de ces besoins. Le développement a été découpé en modules — authentification, algorithme de matching, messagerie — répartis au sein de l'équipe selon les forces de chacun. J'ai suivi une logique itérative : construire une version fonctionnelle minimale de chaque brique, la tester, puis l'enrichir. La préparation de la soutenance a été traitée comme une étape à part entière, avec un script détaillé anticipant les questions du jury.",

  technicalChoices: "Flask a été choisi pour sa légèreté et sa flexibilité : il nous permettait d'aller à l'essentiel sans la lourdeur d'un framework plus complet, tout en gardant un contrôle fin sur l'architecture. MySQL s'imposait naturellement pour la gestion de relations structurées (étudiants, compétences, mise en relation). Pour le matching, un algorithme pondéré a été retenu plutôt qu'une simple correspondance par mots-clés : il permettait de croiser plusieurs critères (matière, disponibilité, niveau) et de hiérarchiser les résultats selon leur pertinence réelle, plutôt que de renvoyer une liste brute.",

  difficulties: "La principale difficulté a résidé dans la conception de l'algorithme de matching pondéré lui-même : trouver le bon équilibre entre les critères, éviter qu'un seul paramètre n'écrase les autres, et obtenir des résultats cohérents à l'usage a demandé plusieurs itérations et tests. La mise en place de la messagerie par polling a aussi posé des défis de synchronisation, sans les outils temps réel plus avancés. Travailler à plusieurs sur un même backend, avec des délais serrés, a enfin exigé une vraie discipline de coordination.",

  result: "Le projet a été mené à son terme dans les délais impartis, avec une plateforme fonctionnelle couvrant l'ensemble du parcours utilisateur : inscription, matching, mise en relation et échange. La soutenance orale, préparée en profondeur, a permis de défendre clairement les choices techniques devant le jury. Au-delà du livrable, ce projet a été une première expérience concrète de travail en équipe sur un produit complet, de la base de données jusqu'à l'interface.",

  role: [
    "Développement backend et frontend au sein de mon équipe",
    "Algorithme de matching pondéré, authentification, messagerie par polling",
    "Préparation approfondie de la soutenance orale"
  ],
  stack: ["Python / Flask", "MySQL", "HTML5", "CSS3", "JavaScript", "Bootstrap"],
  process: [
    { type: "sketch", caption: "Croquis initial de l'algorithme de matching", src: "images/Capture d'écran 2026-07-31 203625.png" },
    { type: "architecture", caption: "Schéma d'architecture backend", src: "images/Capture d'écran 2026-07-31 203357.png" },
    { type: "github", caption: "Capture du dépôt GitHub", src: "images/Capture d'écran 2026-07-31 153759.png" }
  ],
  links: [
    { label: "Voir le code", url: "https://github.com/Kim-AII/PIL1_2526_68.git" },
    { label: "Voir la démo", url: "#" }
  ]
  },

 presidence: {
  eyebrow: "Exercice de style — Mockup institutionnel",
  title: "Présidence.bj — Refonte visuelle",
  tagline: "Une réinterprétation du site de la Présidence du Bénin, pensée pour la rigueur et la scalabilité.",
  tags: ["HTML5", "CSS3", "BEM"],

  context: "Les sites institutionnels imposent des contraintes particulières : ils doivent rester sobres, accessibles à un public très large, et transmettre une image de sérieux et de confiance. J'ai choisi Présidence.bj comme terrain d'exercice pour me confronter à ce type de cahier des charges implicite — concevoir une interface qui inspire la crédibilité, sans artifice inutile, tout en respectant une structure de contenu dense et hiérarchisée.",

  problem: "Comment restituer la richesse d'un site institutionnel (actualités, discours, présentation des institutions, navigation multi-niveaux) sans tomber dans une interface confuse ou surchargée ? Le défi était autant structurel que visuel : organiser un contenu dense de façon lisible, tout en gardant un code HTML/CSS propre et facilement maintenable sur le long terme.",

  approach: "J'ai commencé par une analyse du site existant pour identifier les blocs de contenu récurrents (hero, actualités, sections institutionnelles, footer) et leur hiérarchie. Cette analyse m'a permis de découper l'interface en composants réutilisables avant même d'écrire une ligne de CSS. J'ai ensuite construit chaque bloc en respectant strictement la méthodologie BEM, en veillant à ce que chaque composant reste indépendant et réutilisable ailleurs sur le site.",

  technicalChoices: "La méthodologie BEM (Block Element Modifier) s'imposait pour un projet de cette ampleur : elle évite les conflits de nommage CSS, rend le code lisible même par quelqu'un qui le découvre, et facilite la maintenance à mesure que le nombre de composants augmente. J'ai volontairement évité tout framework CSS pour ce projet, afin de garder un contrôle total sur chaque règle de style et démontrer une maîtrise fine du CSS natif.",

  difficulties: "La principale difficulté a été de conserver une architecture BEM cohérente sur un site avec autant de sections différentes, sans dupliquer inutilement du code ni complexifier le nommage des classes. Reproduire fidèlement la hiérarchie visuelle d'un site institutionnel réel — avec ses contraintes de densité d'information — tout en gardant un rendu responsive propre a aussi demandé plusieurs allers-retours.",

  result: "Le mockup final restitue fidèlement la structure et l'esprit du site original, avec un code HTML/CSS entièrement structuré selon BEM, facilement lisible et prêt à être étendu. Ce projet reste une référence personnelle sur la rigueur d'architecture CSS, réutilisée par la suite sur d'autres projets, notamment mon portfolio.",

  role: [
    "Analyse et découpage du site en composants réutilisables",
    "Développement front-end HTML/CSS avec méthodologie BEM",
    "Optimisation de la structure pour la maintenabilité et le responsive"
  ],
  stack: ["HTML5", "CSS3", "BEM"],
  process: [
    { type: "figma", caption: "Maquette Figma — page d'accueil", src: "images/Copilot_20260731_211724.png" },
    { type: "architecture", caption: "Arborescence des composants BEM", src: "images/Capture d'écran 2026-07-31 211814.png" }
  ],
  links: [
    { label: "Voir le code", url: "https://github.com/Kim-AII" }
  ]
  },

 coach: {
  eyebrow: "Projet personnel — Landing page",
  title: "Landing Page Coach Sportif",
  tagline: "Une page de conversion pensée pour transformer un visiteur en client, avec une identité visuelle énergique.",
  tags: ["HTML5", "CSS3", "JavaScript", "Design system"],

  context: "Un coach sportif indépendant a besoin d'une vitrine qui inspire confiance et donne envie de passer à l'action immédiatement — contrairement à un site institutionnel, chaque seconde d'attention compte. J'ai conçu cette landing page comme un exercice complet de la conception à l'intégration : penser une identité visuelle forte, structurer un parcours de conversion clair, puis le coder de A à Z.",

  problem: "Comment concevoir une page unique capable de capter l'attention en quelques secondes, de transmettre l'énergie et le sérieux d'un coach sportif, et de guider naturellement le visiteur vers une prise de contact ou une inscription ? Il fallait équilibrer impact visuel et clarté du message, sans que le design ne prenne le pas sur la conversion.",

  approach: "J'ai débuté par la définition d'un système de design cohérent — palette, typographie, ton — avant de structurer le parcours utilisateur : accroche, présentation du coach, bénéfices, témoignages, appel à l'action final. Chaque section a été pensée pour répondre à une objection ou renforcer la confiance, dans une logique de copywriting orientée conversion, avant d'être intégrée en HTML/CSS/JS.",

  technicalChoices: "J'ai opté pour une palette dark/vert/orange : le fond sombre installe une ambiance premium et sérieuse, tandis que le vert et l'orange apportent l'énergie et le dynamisme attendus d'un univers sportif. Ce contraste fort permet de guider naturellement l'œil vers les call-to-action, colorés en orange pour se détacher clairement du reste de l'interface. Le JavaScript a été utilisé avec parcimonie, pour des animations légères renforçant l'engagement sans nuire à la performance.",

  difficulties: "Le plus grand défi a été de garder un design system cohérent sur l'ensemble de la page tout en évitant la monotonie visuelle entre les sections. Trouver le bon équilibre entre un style graphique marqué (proche de mon univers manga/comic) et les codes attendus d'une landing page de conversion classique a demandé plusieurs itérations, notamment sur la hiérarchie typographique et l'espacement.",

  result: "La page finale offre un parcours de conversion fluide, porté par une identité visuelle distinctive et mémorable. Ce projet m'a permis de mettre en pratique, sur un cas concret et autonome, l'ensemble de la chaîne : stratégie de contenu, système de design, intégration front-end.",

  role: [
    "Conception du système de design (palette, typographie, composants)",
    "Structuration du parcours de conversion et du copywriting",
    "Développement front-end HTML/CSS/JS"
  ],
  stack: ["HTML5", "CSS3", "JavaScript"],
  process: [
    { type: "sketch", caption: "Wireframe du parcours de conversion", src: "images/Capture d'écran 2026-07-31 210430.png" },
    { type: "github", caption: "Capture du dépôt GitHub", src: "images/Capture d'écran 2026-07-31 210231.png" }
  ],
  links: [
    { label: "Voir la démo", url: "https://curious-marshmallow-9f8a57.netlify.app/" },
    { label: "Voir le code", url: "https://github.com/Kim-AII/-Landing-Page-Coach-Sportif.git" }
  ]
  },

  pir: {
  eyebrow: "Réalisation IoT — Simulation & prototypage",
  title: "Capteur PIR + LED — Système de détection de mouvement",
  tagline: "Une simulation IoT complète, du câblage virtuel au code embarqué, pensée pour des cas d'usage smart agriculture / domotique.",
  tags: ["Arduino", "Tinkercad", "C/C++ embarqué"],

  context: "Les systèmes de détection de mouvement sont au cœur de nombreuses applications IoT concrètes — sécurité, domotique, ou surveillance de zones agricoles pour détecter la présence d'animaux ou d'intrus. J'ai voulu comprendre et maîtriser cette brique de base avant de l'intégrer dans des projets plus larges : un capteur PIR (Passive InfraRed) capable de détecter un mouvement et de déclencher une action, ici l'allumage d'une LED.",

  problem: "Comment concevoir un système fiable qui détecte un mouvement et réagit de manière cohérente, sans faux positifs ni délais de réaction excessifs ? Au-delà du câblage, il fallait écrire un code embarqué capable de gérer correctement les états du capteur (repos, détection, retour au repos) et déboguer les comportements imprévus propres à l'électronique simulée.",

  approach: "J'ai construit le circuit sur Tinkercad, en reliant le capteur PIR, la LED et la carte Arduino selon un schéma de câblage précis. Une fois le montage validé virtuellement, je suis passé à l'écriture du code : lecture de l'état du capteur, logique conditionnelle pour piloter la LED, puis tests successifs pour observer le comportement réel du système face à différents scénarios de mouvement.",

  technicalChoices: "Tinkercad a été choisi pour prototyper sans risque matériel, avec une simulation fidèle du comportement électronique avant tout déploiement réel. Le langage C/C++ embarqué (standard Arduino) s'imposait naturellement pour ce type de carte. J'ai structuré le code autour d'une logique d'état simple mais robuste, plus facile à déboguer et à faire évoluer qu'une suite de conditions imbriquées.",

  difficulties: "Le débogage du code Arduino a été l'étape la plus exigeante : certains comportements du capteur en simulation ne réagissaient pas immédiatement comme attendu, ce qui a demandé de revoir la logique de lecture des états et d'ajuster les délais de réponse dans le code. Ce travail de débogage m'a beaucoup appris sur la rigueur nécessaire en programmation embarquée, où chaque instruction a un effet physique direct.",

  result: "Le système final détecte correctement un mouvement et déclenche l'allumage de la LED de façon fiable et reproductible. Cette réalisation a posé les bases techniques (câblage, logique embarquée, débogage) que je réutilise aujourd'hui dans mon pipeline IoT en cours, avec des cas d'usage plus complexes.",

  role: [
    "Conception et câblage du circuit sur Tinkercad",
    "Écriture et débogage du code Arduino (C/C++ embarqué)",
    "Tests et validation du comportement du système en simulation"
  ],
  stack: ["Arduino", "Tinkercad", "C/C++ embarqué"],
  process: [
    { type: "sketch", caption: "Schéma de câblage du circuit PIR + LED", src: "images/Screenshot1-task2.png" },
    { type: "architecture", caption: "Logique d'état du système (repos / détection)", src: "images/Screenshot-task2.png" },
    { type: "code", caption: "Extrait du code Arduino débogué", src: "images/Capture d'écran 2026-07-31 205457.png" }
  ],
  links: [
    { label: "Voir la simulation Tinkercad", url: "https://www.tinkercad.com/things/8pMhOdFPqEv-exquisite-curcan-migelo" },
  ]
  },

   mqtt: {
    eyebrow: "Stage CodeAlpha — Smart Agriculture",
    title: "IoT Data Pipeline (MQTT Simulation)",
    tagline: "Simulation d'un pipeline de données IoT utilisant le protocole MQTT.",
    tags: ["Python", "MQTT", "Mosquitto", "Node-RED", "InfluxDB", "Grafana"],
    context: "Simuler la communication entre capteurs et serveur via MQTT, pour valider la logique avant un déploiement matériel.",
    problem: "Dans un contexte agricole connecté, les capteurs (température, humidité) doivent transmettre leurs mesures à un serveur central sans monopoliser une bande passante ou une alimentation limitées — contrainte typique des objets connectés en environnement rural. Il fallait valider une architecture de communication légère et découplée avant tout déploiement matériel réel.",
    approach: "Un script Python simule un capteur qui publie des mesures toutes les 5 secondes sur un topic MQTT unique (home/sensors), avec un payload JSON structuré (device_id, localisation, température, humidité). Les données suivent une marche aléatoire bornée plutôt qu'un tirage purement aléatoire, pour reproduire une dérive de mesure réaliste. Côté infrastructure, un broker Mosquitto conteneurisé (Docker) reçoit et relaie les messages ; un flow Node-RED s'y abonne, applique une règle de seuil (alerte si température > 30°C), puis route les données vers une base InfluxDB, visualisées ensuite dans un dashboard Grafana temps réel.",
    technicalChoices: "MQTT a été choisi pour son modèle publish/subscribe : les capteurs n'ont pas besoin de connaître leurs destinataires, ce qui découple totalement la simulation du traitement — une propriété essentielle pour des objets connectés à ressources limitées, contrairement à des protocoles plus lourds comme HTTP avec ses échanges requête/réponse répétés. Mosquitto a été retenu comme broker pour sa légèreté, sa large adoption dans l'écosystème IoT, et sa simplicité de déploiement en conteneur Docker isolé.",
    difficulties: "La principale difficulté a porté sur la cohérence des formats de données entre les étapes du pipeline : le node MQTT de Node-RED parsait automatiquement le JSON reçu, ce qui entrait en conflit avec un parsing manuel supplémentaire dans le code de traitement, provoquant des erreurs silencieuses. Un autre point délicat a été la structuration exacte attendue par le connecteur InfluxDB (distinction entre tags indexés et fields numériques), qui a nécessité plusieurs itérations de débogage à l'aide des nodes debug de Node-RED pour visualiser précisément ce qui transitait à chaque étape du flow.",
    result: "Pipeline fonctionnel de bout en bout : données simulées → broker MQTT → traitement avec règle d'alerte → stockage time-series → dashboard temps réel avec courbes et gauges à seuils colorés. Cette validation logicielle complète démontre la viabilité de l'architecture de communication avant tout déploiement sur capteurs physiques.",
    role: [
      "Développement d'un broker MQTT simulé",
      "Scripts de publication et de souscription aux topics",
      "Visualisation des données reçues"
    ],
    stack: ["Python", "MQTT", "Mosquitto", "Node-RED", "InfluxDB", "Grafana"],
    process: [
      { type: "architecture", caption: "Schéma du pipeline de données", src: "images/iot_pipeline_architecture.png" },
      { type: "github", caption: "Capture du dépôt GitHub", src: "images/Capture d'écran 2026-07-31 212157.png" }
    ],
    links: [{ label: "Voir le dépôt GitHub", url: "https://github.com/Kim-AII/iot-pipeline.git" }]
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
        ${(data.links || []).map(l => `<a href="${l.url}">${l.label} &#8599;</a>`).join('')}
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