// Salvataggio offline: pagina, mappa e libreria restano sul telefono.
const CACHE = 'valencia-202610011218';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.7.1/maplibre-gl.js',
  './mapdata/fonts/NotoSansBold/0-255.txt',
  './mapdata/fonts/NotoSansBold/256-511.txt',
  './mapdata/fonts/NotoSansBold/8192-8447.txt',
  './mapdata/fonts/NotoSansRegular/0-255.txt',
  './mapdata/fonts/NotoSansRegular/256-511.txt',
  './mapdata/fonts/NotoSansRegular/8192-8447.txt',
  './mapdata/vt/10/510/389.txt',
  './mapdata/vt/10/511/389.txt',
  './mapdata/vt/11/1021/779.txt',
  './mapdata/vt/11/1022/779.txt',
  './mapdata/vt/12/2043/1558.txt',
  './mapdata/vt/12/2043/1559.txt',
  './mapdata/vt/12/2044/1558.txt',
  './mapdata/vt/12/2044/1559.txt',
  './mapdata/vt/13/4086/3116.txt',
  './mapdata/vt/13/4086/3117.txt',
  './mapdata/vt/13/4086/3118.txt',
  './mapdata/vt/13/4087/3116.txt',
  './mapdata/vt/13/4087/3117.txt',
  './mapdata/vt/13/4087/3118.txt',
  './mapdata/vt/13/4088/3116.txt',
  './mapdata/vt/13/4088/3117.txt',
  './mapdata/vt/13/4088/3118.txt',
  './mapdata/vt/13/4089/3116.txt',
  './mapdata/vt/13/4089/3117.txt',
  './mapdata/vt/13/4089/3118.txt',
  './mapdata/vt/14/8172/6232.txt',
  './mapdata/vt/14/8172/6233.txt',
  './mapdata/vt/14/8172/6234.txt',
  './mapdata/vt/14/8172/6235.txt',
  './mapdata/vt/14/8172/6236.txt',
  './mapdata/vt/14/8173/6232.txt',
  './mapdata/vt/14/8173/6233.txt',
  './mapdata/vt/14/8173/6234.txt',
  './mapdata/vt/14/8173/6235.txt',
  './mapdata/vt/14/8173/6236.txt',
  './mapdata/vt/14/8174/6232.txt',
  './mapdata/vt/14/8174/6233.txt',
  './mapdata/vt/14/8174/6234.txt',
  './mapdata/vt/14/8174/6235.txt',
  './mapdata/vt/14/8174/6236.txt',
  './mapdata/vt/14/8175/6232.txt',
  './mapdata/vt/14/8175/6233.txt',
  './mapdata/vt/14/8175/6234.txt',
  './mapdata/vt/14/8175/6235.txt',
  './mapdata/vt/14/8175/6236.txt',
  './mapdata/vt/14/8176/6232.txt',
  './mapdata/vt/14/8176/6233.txt',
  './mapdata/vt/14/8176/6234.txt',
  './mapdata/vt/14/8176/6235.txt',
  './mapdata/vt/14/8176/6236.txt',
  './mapdata/vt/14/8177/6232.txt',
  './mapdata/vt/14/8177/6233.txt',
  './mapdata/vt/14/8177/6234.txt',
  './mapdata/vt/14/8177/6235.txt',
  './mapdata/vt/14/8177/6236.txt',
  './mapdata/vt/14/8178/6232.txt',
  './mapdata/vt/14/8178/6233.txt',
  './mapdata/vt/14/8178/6234.txt',
  './mapdata/vt/14/8178/6235.txt',
  './mapdata/vt/14/8178/6236.txt'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // la pagina: prima la rete (per gli aggiornamenti), poi la copia salvata
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('./index.html', c)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // tutto il resto (mappa, font, libreria): prima la copia salvata
  if (url.origin === location.origin || /cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(url.host)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
      return r;
    })));
  }
});
