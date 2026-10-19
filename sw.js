// 홈 화면 앱용: 지도 화면·자료를 저장해 두어 신호가 약한 유적지에서도 열리게 한다.
// 이 사이트 파일은 '먼저 새로 받고, 안 되면 저장본'(고친 내용이 바로 보이게), 지도 프로그램(cdnjs)은 저장본 먼저.
// 지도 바탕(OpenStreetMap 타일)은 따로 저장하지 않는다(사용 정책).
const CACHE = "hcm-v3";  // 저장 파일(아이콘 등)을 바꾸면 숫자를 올린다
const SHELL = ["./", "index.html", "data.js", "heritage_all.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png",
  "stamps/stamp-museum.svg", "stamps/stamp-town.svg", "stamps/stamp-park.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (u.origin === location.origin) {  // 이 사이트: 새로 받기 → 실패하면 저장본
    e.respondWith(fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match("index.html"))));
  } else if (u.hostname === "cdnjs.cloudflare.com") {  // 지도 프로그램: 저장본 먼저
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
    })));
  }
});
