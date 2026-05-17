// ============================================================
// 1. TAMNI / SVJETLI MOD
// Uz pomoć Claude-a razumio sam da localStorage.getItem vraća
// null ako ključ ne postoji, pa koristim || 'light' kao default
// ============================================================

const toggle = document.getElementById('dark-mode-toggle');

function primijeniMod(mod) {
  if (mod === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    if (toggle) toggle.textContent = '🌙';
  }
}

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

// ============================================================
// 2. SCROLL TO TOP
// ============================================================

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
// 3. ANIMIRANI BROJAČI U HERO SEKCIJI
// Uz pomoć Claude-a razumio sam kako requestAnimationFrame
// funkcioniše — sinhronizovan je sa browserom i ne troši
// nepotrebne resurse kao setInterval
// ============================================================

function animirajBrojac(element, cilj, trajanje, sufiks) {
  if (!element) return;
  const pocetak = performance.now();

  function korak(trenutnoVrijeme) {
    const proslo = trenutnoVrijeme - pocetak;
    const napredak = Math.min(proslo / trajanje, 1);
    /* Uz pomoć Claude-a razumio sam easing funkciju —
       Math.pow(1 - napredak, 2) pravi efekat usporavanja pri kraju */
    const eased = 1 - Math.pow(1 - napredak, 2);
    const trenutnaVrijednost = Math.round(eased * cilj);
    element.textContent = trenutnaVrijednost.toLocaleString() + (sufiks || '');
    if (napredak < 1) requestAnimationFrame(korak);
  }

  requestAnimationFrame(korak);
}

window.addEventListener('load', function () {
  animirajBrojac(document.getElementById('counter-smjestaj'), 120, 1500, '+');
  animirajBrojac(document.getElementById('counter-gosti'), 2000, 2000, '+');
});

// ============================================================
// 4. LIVE VISITOR COUNTER
// Uz pomoć Claude-a razumio sam razliku između setTimeout i
// setInterval — koristim rekurzivni setTimeout jer je interval
// nasumičan, a ne fiksni
// ============================================================

const visitorEl = document.getElementById('visitor-count');

if (visitorEl) {
  let bazaBroj = 12 + Math.floor(Math.random() * 20);
  visitorEl.textContent = bazaBroj;

  function azurirajPosjetioce() {
    const promjena = Math.floor(Math.random() * 7) - 3;
    bazaBroj = Math.max(5, Math.min(50, bazaBroj + promjena));
    visitorEl.textContent = bazaBroj;
    const sljedecaAktualizacija = 4000 + Math.random() * 3000;
    setTimeout(azurirajPosjetioce, sljedecaAktualizacija);
  }

  setTimeout(azurirajPosjetioce, 5000);
}

// ============================================================
// 5. FILTRIRANJE KARTICA
// Uz pomoć Claude-a razumio sam kako dataset API funkcioniše —
// data-type i data-cijena atributi se čitaju kroz getAttribute()
// ============================================================

const filterLinkovi = document.querySelectorAll('.filter-link');
const kartice = document.querySelectorAll('.card');
const noResultsPoruka = document.getElementById('no-results');

let aktivniTip = 'sve';
let aktivnaCijena = null;

function filtrirajKartice() {
  let vidljivih = 0;

  kartice.forEach(function (kartica) {
    const tip = kartica.getAttribute('data-type');
    const cijena = kartica.getAttribute('data-cijena');
    const odgovaraTip = (aktivniTip === 'sve') || (tip === aktivniTip);
    const odgovaraCijena = !aktivnaCijena || (cijena === aktivnaCijena);

    if (odgovaraTip && odgovaraCijena) {
      kartica.style.display = '';
      vidljivih++;
    } else {
      kartica.style.display = 'none';
    }
  });

  if (noResultsPoruka) {
    noResultsPoruka.style.display = vidljivih === 0 ? 'block' : 'none';
  }
}

filterLinkovi.forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const filter = this.getAttribute('data-filter');
    const cjenovniFilteri = ['do60', '60-150', '150plus'];

    if (cjenovniFilteri.includes(filter)) {
      if (aktivnaCijena === filter) {
        aktivnaCijena = null;
        this.classList.remove('active');
      } else {
        filterLinkovi.forEach(function (l) {
          if (cjenovniFilteri.includes(l.getAttribute('data-filter'))) {
            l.classList.remove('active');
          }
        });
        aktivnaCijena = filter;
        this.classList.add('active');
      }
    } else {
      filterLinkovi.forEach(function (l) {
        if (!cjenovniFilteri.includes(l.getAttribute('data-filter'))) {
          l.classList.remove('active');
        }
      });
      aktivniTip = filter;
      this.classList.add('active');
    }

    filtrirajKartice();
  });
});