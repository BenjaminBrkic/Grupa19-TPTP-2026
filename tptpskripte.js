/**
 * tptpskripte.js — Tuzla Stay
 * TPTP Završni projekat 2025/2026
 *
 * Sadržaj:
 * 1. Tamni/svjetli mod (toggle + LocalStorage)
 * 2. Filtriranje kartica bez reload-a (POPRAVLJENO)
 * 3. Animirani brojači u hero sekciji
 * 4. Live visitor counter (interaktivni dinamički element)
 * 5. Smooth scroll za bookmark navigaciju
 * 6. Validacija forme (kontakt.html)
 * 7. YouTube modal / popup logika
 * 8. Kalkulator cijene smještaja
 * 9. Scroll to top dugme
 */

// ============================================================
// 1. TAMNI / SVJETLI MOD
// Uz pomoć Claude-a razumio sam da localStorage.getItem vraća
// null ako ključ ne postoji, pa koristim || 'light' kao default.
// ============================================================

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

// Čitanje sačuvanog moda iz LocalStorage-a pri učitavanju stranice
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
// 2. FILTRIRANJE KARTICA (bez reload-a stranice) — POPRAVLJENO
// Svaka kartica ima data-type i data-cijena atribute.
// Filter linkovi imaju data-filter atribute.
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
    // Pretvaramo cijenu iz stringa u broj za matematičko poređenje
    const cijena = parseFloat(kartica.getAttribute('data-cijena')) || 0;

    // Provjera tipa smještaja
    const odgovaraTip = (aktivniTip === 'sve') || (tip === aktivniTip);
    
    // Provjera cjenovnog ranga (Kalkulator opsega cijena)
    let odgovaraCijena = false;
    if (!aktivnaCijena) {
      odgovaraCijena = true; // Ako filter nije izabran, prolaze sve cijene
    } else if (aktivnaCijena === 'do60' && cijena <= 60) {
      odgovaraCijena = true;
    } else if (aktivnaCijena === '60-150' && cijena > 60 && cijena <= 150) {
      odgovaraCijena = true;
    } else if (aktivnaCijena === '150plus' && cijena > 150) {
      odgovaraCijena = true;
    }

    // Kartica se prikazuje samo ako ispunjava OBA uslova
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

// ============================================================
// 3. ANIMIRANI BROJAČI u hero sekciji
// Uz pomoć Claude-a razumio sam requestAnimationFrame i kako
// se koristi za smooth animacije bez setInterval.
// ============================================================

function animirajBrojac(element, cilj, trajanje, sufiks) {
  if (!element) return;

  const pocetak = performance.now();

  function korak(trenutnoVrijeme) {
    const proslo = trenutnoVrijeme - pocetak;
    const napredak = Math.min(proslo / trajanje, 1);

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

// ============================================================
// 4. LIVE VISITOR COUNTER (interaktivni dinamički element)
// Simulira aktivan broj posjetilaca. Mijenja se svakih ~5 sekundi.
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
// 5. SMOOTH SCROLL za bookmark navigaciju
// Uz pomoć Claude-a razumio sam da CSS scroll-behavior: smooth
// ne radi u svim browserima, pa dodajemo i JS fallback.
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (event) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#vrh') return;

    const cilj = document.querySelector(href);
    if (!cilj) return;

    event.preventDefault();

    const headerVisina = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
    const bookmarkVisina = document.querySelector('.bookmark-nav') ? document.querySelector('.bookmark-nav').offsetHeight : 0;
    const ukupniOffset = headerVisina + bookmarkVisina + 16;

    const pozicijaElementa = cilj.getBoundingClientRect().top + window.pageYOffset - ukupniOffset;

    window.scrollTo({
      top: pozicijaElementa,
      behavior: 'smooth'
    });
  });
});
