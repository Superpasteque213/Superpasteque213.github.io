/* ── Theme toggle ── */
const checkbox = document.getElementById('theme-checkbox');
const root     = document.documentElement;

/* dark par défaut, sauf si l'utilisateur a déjà choisi */
const saved = localStorage.getItem('theme') ?? 'dark';
root.setAttribute('data-theme', saved);
checkbox.checked = (saved === 'dark');

checkbox.addEventListener('change', () => {
  const next = checkbox.checked ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ── Page 3 — carousels ── */
document.querySelectorAll('.carousel').forEach(carousel => {
  const track  = carousel.querySelector('.carousel-track');
  const imgs   = carousel.querySelectorAll('img');
  const dotsEl = carousel.querySelector('.carousel-dots');
  const total  = imgs.length;
  let current  = 0;

  /* génère les dots */
  imgs.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  carousel.querySelector('.prev').addEventListener('click', () => goTo(current - 1));
  carousel.querySelector('.next').addEventListener('click', () => goTo(current + 1));

  /* ── Swipe / pavé tactile ── */
  let startX   = null;
  let dragging = false;

  carousel.addEventListener('pointerdown', e => {
    if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dots')) return;
    startX   = e.clientX;
    dragging = true;
  });

  carousel.addEventListener('pointermove', e => {
    if (!dragging) return;
    e.preventDefault();
    const delta = e.clientX - startX;
    track.style.transition = 'none';
    track.style.transform  = `translateX(calc(-${current * 100}% + ${delta}px))`;
  });

  const endDrag = e => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    const delta     = e.clientX - startX;
    const threshold = carousel.offsetWidth * 0.2;
    if (delta < -threshold)     goTo(current + 1);
    else if (delta > threshold) goTo(current - 1);
    else                        goTo(current);
    startX = null;
  };

  carousel.addEventListener('pointerup',     endDrag);
  carousel.addEventListener('pointerleave',  endDrag);
  carousel.addEventListener('pointercancel', endDrag);

  /* ── Pavé tactile deux doigts (wheel deltaX) ── */
  let wheelCooldown = false;

  carousel.addEventListener('wheel', e => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (!isHorizontal) return;

    e.preventDefault();
    if (wheelCooldown) return;

    if (e.deltaX > 30)       goTo(current + 1);
    else if (e.deltaX < -30) goTo(current - 1);

    wheelCooldown = true;
    setTimeout(() => { wheelCooldown = false; }, 500);
  }, { passive: false });
});

/* ── Page 3 — sticky scroll ── */
const projects = [
  {
    name:  'Bonus',
    stack: [
      'devicon-flutter-plain colored',
      'devicon-express-original',
      'devicon-nextjs-original-wordmark',
      'devicon-mysql-plain colored',
    ],
    desc:  "Mon projet dont je suis le plus fier ! Bonus est une application de centralisation de cartes de fidélité et d'offres promotionnelles. Développé en collaboration avec mon binôme, je me suis chargé de l'API et de la gestion du backend en général quand mon binôme se chargeait de l'application mobile en Flutter. C'est un projet de code mais également entrepreneurial qui nous a valu le 4ème prix Pépite NC 2025 !",
    link:  'https://bonus.nc',
  },
  {
    name:  'Pacificsecurite.nc',
    stack: [
      '/images/shopify.png',
      'devicon-html5-plain colored',
      'devicon-css3-plain colored',
      'devicon-javascript-plain colored',
    ],
    desc:  "Un site de e-commerce développé sur shopify, en binôme sur ce projet nous avons imaginé et disposé les différents éléments, customisé le css, saisis les images et les prix, et formé une partie du personnel à la maintenance du site et la gestion des commandes",
    link:  'https://pacificsecurite.nc',
  },
  {
    name:  'Tradehelm',
    stack: [
      'devicon-fastify-plain',
      'devicon-react-original colored',
      'devicon-redis-plain colored',
    ],
    desc:  "Tradehelm est un projet développé lors du Cassini Hackathon 2025, où nous avons remporté le 1er prix en Nouvelle-Calédonie et obtenu la 5ᵉ place au classement global. Il s’agit d’un jeu multijoueur sur navigateur utilisant des données géospatiales satellites via une API pour recréer des environnements réalistes et leurs ressources. Les joueurs apparaissent sur une même planète et doivent gérer et exploiter les ressources de manière collaborative, leurs actions influençant les autres. Le jeu vise à sensibiliser à la gestion durable des ressources et aux enjeux environnementaux mondiaux.",
    link:  'https://taikai.network/cassinihackathons/hackathons/eu-space-consumer-experience/projects/cmh890hy102pcgs2wj7v9q90k/idea',
  },
];

const slides    = document.querySelectorAll('.proj-slide');
const projInfo  = document.querySelector('.proj-info');
const projName  = document.querySelector('.proj-name');
const projStack = document.querySelector('.proj-stack');
const projDesc  = document.querySelector('.proj-desc');
const projLink  = document.querySelector('.proj-link');

let current = -1;

function updatePanel(index) {
  if (index === current) return;
  current = index;

  const p = projects[index];

  projInfo.classList.add('fade-out');

  setTimeout(() => {
    projName.textContent = p.name;
    projDesc.textContent = p.desc;
    projLink.href        = p.link;
    projStack.innerHTML  = p.stack.map(item =>
      item.startsWith('/')
        ? `<img src="${item}" class="proj-stack-img" alt="">`
        : `<i class="${item}"></i>`
    ).join('');
    projInfo.classList.remove('fade-out');
  }, 280);
}

/* Initialise avec le premier projet */
updatePanel(0);

/* Peuple les blocs de description mobile (un par slide) */
document.querySelectorAll('.proj-slide').forEach((slide, i) => {
  const p = projects[i];
  if (!p) return;
  slide.querySelector('.proj-name-m').textContent  = p.name;
  slide.querySelector('.proj-desc-m').textContent  = p.desc;
  slide.querySelector('.proj-link-m').href         = p.link;
  slide.querySelector('.proj-stack-m').innerHTML   = p.stack.map(item =>
    item.startsWith('/')
      ? `<img src="${item}" class="proj-stack-img" alt="">`
      : `<i class="${item}"></i>`
  ).join('');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      updatePanel(parseInt(entry.target.dataset.index));
    }
  });
}, { threshold: 0.5 });

slides.forEach(slide => observer.observe(slide));
