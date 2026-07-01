const CACHE = 'sfc3-v1';
const STATIC_ASSETS = [
  '.',
  'index.html',
  'manifest.json',
  'assets/icon-192.svg',
  'assets/icon-512.svg'
];
const CDN_CACHE = 'sfc3-cdn-v1';
const CDN_URLS = [
  'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap',
  'https://cdn.jsdelivr.net/npm/lucide@0.469.0/dist/umd/lucide.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(STATIC_ASSETS);
    const cdnCache = await caches.open(CDN_CACHE);
    await Promise.allSettled(CDN_URLS.map(url =>
      cdnCache.add(url).catch(() => {})
    ));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => {
      if (k !== CACHE && k !== CDN_CACHE) return caches.delete(k);
    }));
  })());
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // For CDN resources: cache-first
  if (CDN_URLS.some(cdn => url.href.startsWith(cdn.split('?')[0]))) {
    event.respondWith(cacheFirst(request, CDN_CACHE));
    return;
  }

  // For Supabase API: network-only (no cache)
  if (url.hostname.includes('supabase')) {
    event.respondWith(networkOnly(request));
    return;
  }

  // For OSM tiles: network-only (too large to cache)
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(networkOnly(request));
    return;
  }

  // For static app assets: network-first, fallback to cache
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName || CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      const cache = await caches.open(CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return caches.match('.') || caches.match('index.html');
    }
    return new Response('Offline', { status: 503 });
  }
}

async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch {
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
