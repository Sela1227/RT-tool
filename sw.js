// RT-Tool Service Worker
// Kit 坑 #13: 只快取 GET；#14: CACHE_VERSION 跟隨 app 版本
// Kit 坑 #75: App Shell 用 addAll（保證完整）、CDN 用 allSettled（受限網路降級不擋安裝）
const CACHE_VERSION = 'rt-tool-3.6.2';

// ── App Shell：本地必要檔案（相對路徑，Kit 坑 #39 GitHub Pages 子路徑）──
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/logo.jpg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './js/utils.js',
  './data/icd10.js',
  './data/constraints.js',
  './data/dose-recs.js',
  './js/tools-rt.js',
  './js/tools-calc.js',
  './js/tools-score.js',
  './js/staging.js',
  './js/ui-icd.js',
  './js/ui-constraints.js',
  './js/app.js',
];

// ── CDN 函式庫：醫院 / 院內網路可能封鎖 ──
// 用 allSettled：封鎖時個別失敗，SW 仍安裝成功（降級成連線時再載）
const CDN = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // 1) 本地 shell 必須全部成功（缺檔本來就該失敗）
    await cache.addAll(SHELL);
    // 2) CDN 盡力而為 — 封鎖 / 離線時不讓整個安裝失敗
    await Promise.allSettled(
      CDN.map((u) => cache.add(new Request(u, { mode: 'no-cors' })))
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;   // Kit 坑 #13：只處理 GET

  const url = new URL(req.url);
  const isCDN = CDN.some((c) => req.url.startsWith(c.split('?')[0])) ||
                url.hostname.endsWith('fonts.gstatic.com');

  // 跨域但非我們認得的 CDN → 直接放行
  if (url.origin !== self.location.origin && !isCDN) return;

  // Cache-first + 背景更新（stale-while-revalidate）
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then((res) => {
      // no-cors 的 opaque response status 為 0，仍需存
      if (res && (res.status === 200 || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
      }
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
