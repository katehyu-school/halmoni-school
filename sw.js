const CACHE = 'dr-mobile-v2'; // v1→v2: 아래 버그로 사이트 전체가 잘못 캐시돼 있던 걸 강제로 비우기 위해 이름을 올림
const ASSETS = ['./dr-mobile.html', './hq-mobile.html', './manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting(); // 새 sw.js를 받는 즉시 적용 — 탭을 다 닫았다 열 때까지 기다리지 않게 함
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // 열려 있는 탭들도 바로 새 워커가 맡도록
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // register()가 scope 지정 없이 sw.js를 등록해서, 이 fetch 핸들러가 이 도메인의 "모든" GET 요청에 적용되고 있었음
  // (index.html, nhs.html 포함). 그래서 배포해도 방문자가 stale-while-revalidate 캐시에 걸려 예전 페이지를
  // 계속 보게 되는 버그가 있었음 — dr-mobile.html의 오프라인 지원용으로만 쓰려던 것이었는데 범위가 새어나간 것.
  // 이제 ASSETS에 있는 모바일 전용 파일만 캐시 대상으로 하고, 나머지(index.html 등)는 캐시 개입 없이 항상 네트워크로.
  const url = new URL(e.request.url);
  const isMobileAsset = ASSETS.some(a => url.pathname.endsWith(a.replace('./', '/')));
  if (!isMobileAsset) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
