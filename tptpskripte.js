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

// ============================================================
// 6. VALIDACIJA FORME (kontakt.html)
// Isključivo JavaScript — bez HTML5 required/pattern atributa.
// Regex pattern za email pronašao/la uz pomoć Claude-a.
// ============================================================

const emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;
const telefonRegex = /^\+?[\d\s\-\(\)]{7,15}$/;

const forma = document.getElementById('kontakt-forma');
const successMsg = document.getElementById('success-msg');
const successText = document.getElementById('success-text');
const resetBtn = document.getElementById('reset-btn');

function prikaziGresku(idPolja, poruka) {
  const polje = document.getElementById(idPolja);
  const greska = document.getElementById('error-' + idPolja);

  if (polje) polje.classList.add('input-error');
  if (greska) greska.textContent = poruka;
}

function ocistiGresku(idPolja) {
  const polje = document.getElementById(idPolja);
  const greska = document.getElementById('error-' + idPolja);

  if (polje) polje.classList.remove('input-error');
  if (greska) greska.textContent = '';
}

function validirajFormu() {
  let ispravna = true;

  ['ime', 'prezime', 'email', 'telefon', 'tema', 'poruka'].forEach(ocistiGresku);

  const imeVrijednost = document.getElementById('ime') ? document.getElementById('ime').value.trim() : '';
  if (imeVrijednost.length < 2) {
    prikaziGresku('ime', 'Ime mora imati najmanje 2 znaka.');
    ispravna = false;
  }

  const prezimeVrijednost = document.getElementById('prezime') ? document.getElementById('prezime').value.trim() : '';
  if (prezimeVrijednost.length < 2) {
    prikaziGresku('prezime', 'Prezime mora imati najmanje 2 znaka.');
    ispravna = false;
  }

  const emailVrijednost = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
  if (!emailRegex.test(emailVrijednost)) {
    prikaziGresku('email', 'Unesite ispravnu e-mail adresu (npr. ime@domena.ba).');
    ispravna = false;
  }

  const telefonVrijednost = document.getElementById('telefon') ? document.getElementById('telefon').value.trim() : '';
  if (!telefonRegex.test(telefonVrijednost)) {
    prikaziGresku('telefon', 'Telefon može sadržavati samo cifre, razmake, crtice i +.');
    ispravna = false;
  }

  const temaVrijednost = document.getElementById('tema') ? document.getElementById('tema').value : '';
  if (!temaVrijednost) {
    prikaziGresku('tema', 'Molimo odaberite temu upita.');
    ispravna = false;
  }

  const porukaVrijednost = document.getElementById('poruka') ? document.getElementById('poruka').value.trim() : '';
  if (porukaVrijednost.length < 10) {
    prikaziGresku('poruka', 'Poruka mora imati najmanje 10 znakova.');
    ispravna = false;
  }

  return ispravna;
}

if (forma) {
  forma.addEventListener('submit', function (event) {
    event.preventDefault();

    if (successMsg) successMsg.style.display = 'none';

    if (validirajFormu()) {
      const ime = document.getElementById('ime').value.trim();
      const prezime = document.getElementById('prezime').value.trim();

      if (successText) {
        successText.textContent = 'Hvala, ' + ime + ' ' + prezime + '! Vaša poruka je uspješno poslana.';
      }

      if (successMsg) {
        successMsg.style.display = 'flex';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      forma.reset();
    }
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', function () {
    if (forma) forma.reset();
    ['ime', 'prezime', 'email', 'telefon', 'tema', 'poruka'].forEach(ocistiGresku);
    if (successMsg) successMsg.style.display = 'none';
  });
}

['ime', 'prezime', 'email', 'telefon', 'tema', 'poruka'].forEach(function (idPolja) {
  const el = document.getElementById(idPolja);
  if (el) {
    el.addEventListener('input', function () {
      ocistiGresku(idPolja);
    });
    el.addEventListener('blur', function () {
      const val = this.value.trim();

      if (idPolja === 'ime' && val.length > 0 && val.length < 2) {
        prikaziGresku('ime', 'Ime mora imati najmanje 2 znaka.');
      }
      if (idPolja === 'prezime' && val.length > 0 && val.length < 2) {
        prikaziGresku('prezime', 'Prezime mora imati najmanje 2 znaka.');
      }
      if (idPolja === 'email' && val.length > 0 && !emailRegex.test(val)) {
        prikaziGresku('email', 'Unesite ispravnu e-mail adresu.');
      }
      if (idPolja === 'telefon' && val.length > 0 && !telefonRegex.test(val)) {
        prikaziGresku('telefon', 'Neispravan format telefona.');
      }
    });
  }
});

// ============================================================
// 7. YOUTUBE MODAL / POPUP LOGIKA
// Otvara video u modalnom prozoru na klik sličice
// ============================================================

window.otvoriVideo = function() {
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("modalIframe");
  
  if (modal && iframe) {
    iframe.src = "https://www.youtube.com/embed/AL3Wm9eKAnY?autoplay=1&rel=0";
    modal.style.display = "flex";
  }
};

window.zatvoriVideo = function() {
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("modalIframe");
  
  if (modal && iframe) {
    iframe.src = "";
    modal.style.display = "none";
  }
};

// ============================================================
// 8. KALKULATOR CIJENE SMJEŠTAJA
// Uz pomoć Claude-a razumio sam kako koristiti parseFloat i
// toFixed za formatiranje decimalnih brojeva u JS.
// ============================================================

function izracunajCijenu() {
  var smjestajEl = document.getElementById('kalk-smjestaj');
  var nociEl = document.getElementById('kalk-noci');
  var sezonaEl = document.getElementById('kalk-sezona');
  var iznosEl = document.getElementById('kalk-iznos');
  var detaljiEl = document.getElementById('kalk-detalji');
  var poNociEl = document.getElementById('kalk-po-noci');

  if (!smjestajEl || !nociEl || !sezonaEl || !iznosEl || !detaljiEl || !poNociEl) {
    return;
  }

  var cijenaPoNoci = parseFloat(smjestajEl.value);
  var brojNoci = parseInt(nociEl.value);
  var faktorSezone = parseFloat(sezonaEl.value);

  if (isNaN(cijenaPoNoci) || isNaN(brojNoci) || isNaN(faktorSezone)) {
    return;
  }

  var cijenaSaSezonom = cijenaPoNoci * faktorSezone;
  var ukupno = cijenaSaSezonom * brojNoci;

  iznosEl.textContent = ukupno.toFixed(2) + " KM";
  poNociEl.textContent = cijenaSaSezonom.toFixed(2) + " KM";

  detaljiEl.textContent =
    brojNoci + " noći × " +
    cijenaPoNoci + " KM × sezona " +
    faktorSezone;
}

// Event listeneri
document.addEventListener('DOMContentLoaded', function () {
  var elementi = [
    'kalk-smjestaj',
    'kalk-noci',
    'kalk-sezona'
  ];

  elementi.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', izracunajCijenu);
      el.addEventListener('input', izracunajCijenu);
    }
  });

  izracunajCijenu();
});
