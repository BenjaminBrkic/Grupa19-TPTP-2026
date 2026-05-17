// 1. TAMNI / SVJETLI MOD
function primijeniMod(mod) {
  if (mod === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    if (toggle) toggle.textContent = '🌙';
  }
}

const toggle = document.getElementById('dark-mode-toggle');
const sacuvaniMod = localStorage.getItem('tuzlastay-mod') || 'light';
primijeniMod(sacuvaniMod);

if (toggle) {
  toggle.addEventListener('click', function () {
    const trenutniMod = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const noviMod = trenutniMod === 'dark' ? 'light' : 'dark';
    primijeniMod(noviMod);
    localStorage.setItem('tuzlastay-mod', noviMod);
  });
}

// 2. SCROLL TO TOP
const scrollBtn = document.getElementById('scroll-to-top');

if (scrollBtn) {
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('vidljiv');
    } else {
      scrollBtn.classList.remove('vidljiv');
    }
  });

  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
// ============================================================
// ANIMIRANI BROJAČI U HERO SEKCIJI
// Uz pomoć Claude-a razumio sam kako requestAnimationFrame
// funkcioniše i zašto je bolji od setInterval za animacije —
// sinhronizovan je sa browserom i ne troši nepotrebne resurse
// ============================================================

function animirajBrojac(element, cilj, trajanje, sufiks) {
  if (!element) return;

  const pocetak = performance.now();

  function korak(trenutnoVrijeme) {
    const proslo = trenutnoVrijeme - pocetak;
    const napredak = Math.min(proslo / trajanje, 1);

    /* Uz pomoć Claude-a razumio sam easing funkciju —
       Math.pow(1 - napredak, 2) pravi efekat usporavanja
       pri kraju animacije umjesto linearnog kretanja */
    const eased = 1 - Math.pow(1 - napredak, 2);
    const trenutnaVrijednost = Math.round(eased * cilj);

    element.textContent = trenutnaVrijednost.toLocaleString() + (sufiks || '');

    if (napredak < 1) {
      requestAnimationFrame(korak);
    }
  }

  requestAnimationFrame(korak);
}

window.addEventListener('load', function () {
  animirajBrojac(document.getElementById('counter-smjestaj'), 120, 1500, '+');
  animirajBrojac(document.getElementById('counter-gosti'), 2000, 2000, '+');
});