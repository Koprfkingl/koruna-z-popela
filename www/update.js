/* On Android and Mac: ask GitHub once per start whether a newer version is out,
   and if so put a red "new version" button in the top bar. Windows updates itself. */
(function () {
  'use strict';
  const REPO = 'Koprfkingl/koruna-z-popela';
  const ua = navigator.userAgent, C = window.Capacitor;
  const android = !!(C && C.isNativePlatform && C.isNativePlatform() && C.getPlatform() === 'android');
  const mac = /Electron/.test(ua) && /Macintosh/.test(ua);
  const mine = window.APP_VERSION;
  if (!(android || mac) || !mine) return;
  const newer = (a, b) => { a = a.split('.').map(Number); b = b.split('.').map(Number); for (let i = 0; i < 3; i++) { if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) > (b[i] || 0); } return false; };
  const show = (ver, url) => {
    const top = document.querySelector('#t18 .top'); if (!top) return setTimeout(() => show(ver, url), 500);
    const b = document.createElement('button'); b.className = 'tb red'; b.textContent = 'Nová verze ' + ver;
    b.title = android ? 'Stáhni APK a nainstaluj ho přes stávající hru. Uložené hry zůstanou.' : 'Stáhni .dmg a přetáhni hru do Aplikací. Uložené hry zůstanou.';
    b.onclick = () => window.open(url, '_blank');
    top.insertBefore(b, top.querySelector('.tb'));
  };
  fetch('https://api.github.com/repos/' + REPO + '/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
    .then(r => r.ok ? r.json() : null)
    .then(rel => {
      if (!rel || !rel.tag_name) return;
      const ver = rel.tag_name.replace(/^v/, ''); if (!newer(ver, mine)) return;
      const asset = (rel.assets || []).find(a => android ? /\.apk$/.test(a.name) : /\.dmg$/.test(a.name));
      show(ver, asset ? asset.browser_download_url : rel.html_url);
    }).catch(() => {});
})();
