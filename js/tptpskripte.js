// ============================================================
// TAMNI / SVJETLI MOD
//
// Uz pomoć Claude AI-a naučio sam da localStorage.getItem
// vraća null ako ključ ne postoji, pa koristim || 'light'
// kao default. classList.add/remove mijenja CSS klase na
// body elementu bez reload-a stranice.
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
// YOUTUBE MODAL / POPUP LOGIKA
//
// Uz pomoć Claude AI-a naučio sam zašto koristimo window.xxx
// za ove funkcije — HTML onclick="" atribut traži funkcije u
// globalnom (window) scopu. Da smo ih definisali kao obične
// const/let, bile bi u lokalnom scopu i HTML ih ne bi vidio.
// ============================================================

window.otvoriVideo = function () {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('modalIframe');

  if (modal && iframe) {
    iframe.src = 'https://www.youtube.com/embed/AL3Wm9eKAnY?autoplay=1&rel=0';
    modal.style.display = 'flex';
  }
};

window.zatvoriVideo = function () {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('modalIframe');

  if (modal && iframe) {
    iframe.src = '';
    modal.style.display = 'none';
  }
};
// ============================================================
// VALIDACIJA KONTAKT FORME
//
// Uz pomoć Claude AI-a naučio sam kako regex funkcioniše
// za provjeru formata emaila i telefona. Razumio sam i
// razliku između 'input' i 'blur' event listenera —
// input se okida pri svakom kucanju, a blur kad korisnik
// napusti polje.
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

  const imeVal = document.getElementById('ime') ? document.getElementById('ime').value.trim() : '';
  if (imeVal.length < 2) { prikaziGresku('ime', 'Ime mora imati najmanje 2 znaka.'); ispravna = false; }

  const prezimeVal = document.getElementById('prezime') ? document.getElementById('prezime').value.trim() : '';
  if (prezimeVal.length < 2) { prikaziGresku('prezime', 'Prezime mora imati najmanje 2 znaka.'); ispravna = false; }

  const emailVal = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
  if (!emailRegex.test(emailVal)) { prikaziGresku('email', 'Unesite ispravnu e-mail adresu (npr. ime@domena.ba).'); ispravna = false; }

  const telefonVal = document.getElementById('telefon') ? document.getElementById('telefon').value.trim() : '';
  if (!telefonRegex.test(telefonVal)) { prikaziGresku('telefon', 'Telefon može sadržavati samo cifre, razmake, crtice i +.'); ispravna = false; }

  const temaVal = document.getElementById('tema') ? document.getElementById('tema').value : '';
  if (!temaVal) { prikaziGresku('tema', 'Molimo odaberite temu upita.'); ispravna = false; }

  const porukaVal = document.getElementById('poruka') ? document.getElementById('poruka').value.trim() : '';
  if (porukaVal.length < 10) { prikaziGresku('poruka', 'Poruka mora imati najmanje 10 znakova.'); ispravna = false; }

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
    el.addEventListener('input', function () { ocistiGresku(idPolja); });
    el.addEventListener('blur', function () {
      const val = this.value.trim();
      if (idPolja === 'ime' && val.length > 0 && val.length < 2) prikaziGresku('ime', 'Ime mora imati najmanje 2 znaka.');
      if (idPolja === 'prezime' && val.length > 0 && val.length < 2) prikaziGresku('prezime', 'Prezime mora imati najmanje 2 znaka.');
      if (idPolja === 'email' && val.length > 0 && !emailRegex.test(val)) prikaziGresku('email', 'Unesite ispravnu e-mail adresu.');
      if (idPolja === 'telefon' && val.length > 0 && !telefonRegex.test(val)) prikaziGresku('telefon', 'Neispravan format telefona.');
    });
  }
});