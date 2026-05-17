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