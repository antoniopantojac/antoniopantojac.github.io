// ==========================================
// Service Worker para PWA
// Versión: 1.0.0
// ==========================================

const CACHE_NAME = 'puerres-map-v4-' + Date.now(); // Versión 4 para forzar actualización
const RUNTIME_CACHE = 'puerres-runtime-v4-' + Date.now();

// Archivos a cachear durante la instalación
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/map.js',
    // '/js/translations.js', // Archivo eliminado
    '/manifest.json',
    // CDN Resources (se cachearán en runtime)
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ==========================================
// Instalación del Service Worker
// ==========================================
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Instalando (MODO DESARROLLO - SIN CACHÉ)...');
    
    event.waitUntil(
        // NO precachear nada, ir directo a activación
        Promise.resolve()
            .then(() => {
                console.log('✅ Service Worker: Instalación completada (sin precache)');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Error durante la instalación:', error);
            })
    );
});

// ==========================================
// Activación del Service Worker
// ==========================================
self.addEventListener('activate', (event) => {
    console.log('🎯 Service Worker: Activando...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Eliminar cachés antiguos
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('🗑️ Service Worker: Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('✅ Service Worker: Activación completada');
            // ELIMINAR TODOS LOS CACHÉS SIN EXCEPCIÓN
            return caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        console.log('🗑️ ELIMINANDO caché:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            });
        })
        .then(() => {
            console.log('🔄 Service Worker: Todos los cachés limpiados, forzando actualización completa');
            // Notificar a todos los clientes que se actualice
            return self.clients.claim();
        })
        .then(() => {
            // Enviar mensaje a todos los clientes para que recarguen
            return self.clients.matchAll();
        })
        .then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'SW_UPDATED',
                    message: 'Service Worker actualizado. Recargando página...'
                });
            });
        })
    );
});

// ==========================================
// Intercepción de Peticiones (Fetch)
// ==========================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Estrategia: SIEMPRE RED PRIMERO para desarrollo
    if (url.origin === location.origin) {
        // Para TODOS los archivos locales, siempre red primero (sin caché)
        event.respondWith(alwaysNetworkFirst(request));
    }
    // Estrategia: Network First para tiles de mapas
    else if (url.hostname.includes('tile.openstreetmap.org')) {
        event.respondWith(networkFirst(request));
    }
    // Estrategia: Stale While Revalidate para CDN
    else if (url.hostname.includes('unpkg.com') || 
             url.hostname.includes('cdnjs.cloudflare.com')) {
        event.respondWith(staleWhileRevalidate(request));
    }
    // Default: Network First
    else {
        event.respondWith(networkFirst(request));
    }
});

// ==========================================
// Estrategia: Cache First
// Intenta desde caché, si falla va a red
// ==========================================
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        console.log('📦 Desde caché:', request.url);
        return cachedResponse;
    }

    try {
        console.log('🌐 Desde red:', request.url);
        const networkResponse = await fetch(request);
        
        // Cachear la nueva respuesta
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Error en fetch:', error);
        
        // Retornar página offline si existe
        return caches.match('/index.html');
    }
}

// ==========================================
// Estrategia: Network First
// Intenta desde red, si falla usa caché
// ==========================================
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cachear en runtime
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🌐➡️📦 Red falló, intentando caché:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// ==========================================
// Estrategia: SIEMPRE RED PRIMERO (Para desarrollo)
// NUNCA usa caché para archivos locales, siempre red
// ==========================================
async function alwaysNetworkFirst(request) {
    try {
        // SIEMPRE intentar red primero, SIN caché
        const networkResponse = await fetch(request, {
            cache: 'no-store', // NUNCA usar caché del navegador
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (networkResponse && networkResponse.status === 200) {
            console.log('🌐 SIEMPRE desde red (sin caché):', request.url);
            return networkResponse;
        }
        
        throw new Error('Respuesta de red no válida');
        
    } catch (error) {
        console.log('❌ Red falló completamente:', request.url, error);
        
        // SOLO como último recurso, intentar caché
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('🚨 ÚLTIMO RECURSO - Desde caché:', request.url);
            return cachedResponse;
        }
        
        // Si es página HTML y no hay nada, retornar página principal
        if (request.url.includes('.html') || request.url === '/') {
            const fallbackResponse = await caches.match('/index.html');
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }
        
        throw error;
    }
}

// ==========================================
// Estrategia: Network First con Fallback Agresivo
// Siempre intenta red primero, fallback a caché solo si es crítico
// ==========================================
async function networkFirstWithFallback(request) {
    try {
        // Intentar red primero con timeout corto
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
        
        // Agregar timestamp para evitar caché del navegador
        const urlWithTimestamp = new URL(request.url);
        urlWithTimestamp.searchParams.set('v', Date.now());
        
        const networkResponse = await fetch(urlWithTimestamp.toString(), { 
            signal: controller.signal,
            cache: 'no-cache', // Forzar no usar caché del navegador
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        clearTimeout(timeoutId);
        
        // Si la respuesta es exitosa, cachear y retornar
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            console.log('🌐 Servido desde red (actualizado):', request.url);
            return networkResponse;
        }
        
        // Si la respuesta no es exitosa, intentar caché
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Red falló, sirviendo desde caché:', request.url);
            return cachedResponse;
        }
        
        throw new Error('No hay respuesta de red ni caché');
        
    } catch (error) {
        console.log('🌐➡️📦 Red falló, intentando caché:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('📦 Sirviendo desde caché (offline):', request.url);
            return cachedResponse;
        }
        
        // Para archivos críticos, retornar página principal
        if (request.url.includes('.html') || request.url === '/') {
            const fallbackResponse = await caches.match('/index.html');
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }
        
        throw error;
    }
}

// ==========================================
// Estrategia: Stale While Revalidate
// Retorna caché inmediatamente y actualiza en background
// ==========================================
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
            const cache = caches.open(RUNTIME_CACHE);
            cache.then(c => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    }).catch(error => {
        console.log('Error en background fetch:', error);
    });

    return cachedResponse || fetchPromise;
}

// ==========================================
// Mensajes del Service Worker
// ==========================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }
});

// ==========================================
// Sincronización en Background (opcional)
// ==========================================
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    // Aquí podrías sincronizar datos cuando haya conexión
    console.log('Sincronizando datos...');
}

// ==========================================
// Notificaciones Push (opcional)
// ==========================================
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || 'Nueva actualización disponible',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Mapa de Puerres', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

console.log('🚀 Service Worker cargado correctamente');


