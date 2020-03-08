if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(reg => {
            console.log("success：", reg);
        }).catch(err => {
            console.log("fail：", err);
        });
    });
};


window.addEventListener('load', function () {
    const sw = window.navigator.serviceWorker
    const killSW = window.killSW || false
    if (!sw) {
        return
    }
    if (!!killSW) {
        sw.getRegistration('/serviceWorker').then(registration => {
            // 手动注销
            registration.unregister();
            // 清除缓存
            window.caches && caches.keys && caches.keys().then(function (keys) {
                keys.forEach(function (key) {
                    caches.delete(key);
                });
            });
        })
    } else {
        // 表示该 sw 监听的是根域名下的请求
        sw.register('/service-worker.js', { scope: '/' }).then(registration => {
            // 注册成功后会进入回调
            console.log('Registered events at scope: ', registration.scope);
        }).catch(err => {
            console.error(err)
        })
    }
});