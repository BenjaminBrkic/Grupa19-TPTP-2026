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
