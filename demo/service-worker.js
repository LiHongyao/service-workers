// => 安装
// 用于标注创建的缓存，也可以根据它来建立版本规范
const CACHE_NAME = "cache_v1.0.1";
// 列举要默认缓存的静态资源，一般用于离线使用
const urlsToCache = [
    '/index.html',
    '/js/index.js',
    '/css/index.css',
    '/images/jayChou.jpeg'
];
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
})


// => 激活
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            // 筛选除当前缓存外的所有缓存
            return cacheNames.filter(cacheName => cacheName !== CACHE_NAME);
        }).then(cachesToDelete => {
            // 删除需要删除的缓存
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => {
            // 立即接管所有页面
            self.clients.claim();
        })
    );
});

// => fetch
// 发起请求时去根据uri去匹配缓存，无法命中缓存则发起请求，并且缓存请求
self.addEventListener('fetch', event => {
    event.respondWith(
        // 先去缓存中查找请求的文件
        caches.match(event.request).then(resp => {
            // 如果找到了就返回缓存文件
            // 如果没有找到则发起请求
            return resp || fetch(event.request).then(response => {
                // 请求成功之后将新的资源存入缓存中，然后在返回下载的资源
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});





