// ==========================================
// Service Worker para PWA Mapa de Puerres
// ==========================================

const CACHE_NAME = 'puerres-map-v1-' + Date.now();
const RUNTIME_CACHE = 'puerres-runtime-v1-' + Date.now();

// Archivos críticos para precachear
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/map.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Recursos externos críticos
const EXTERNAL_CACHE = [
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// ==========================================
// Evento de Instalación
// ==========================================
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Instalando...');
    
    event.waitUntil(
        Promise.resolve().then(() => {
            console.log('✅ Service Worker: Instalación completada (MODO DESARROLLO)');
        })
    );
    
    // Forzar activación inmediata
    self.skipWaiting();
});

// ==========================================
// Evento de Activación
// ==========================================
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activando...');
    
    event.waitUntil(
        Promise.all([
            // Limpiar cachés antiguos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        console.log('🗑️ Eliminando caché:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            }),
            
            // Tomar control de todos los clientes
            self.clients.claim()
        ]).then(() => {
            console.log('✅ Service Worker: Activación completada');
            
            // Notificar a los clientes que hay una nueva versión
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({ type: 'SW_UPDATED' });
                });
            });
        })
    );
});

// ==========================================
// Evento de Fetch
// ==========================================
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Solo manejar requests HTTP/HTTPS
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    // Estrategia para archivos locales
    if (isLocalFile(url)) {
        event.respondWith(alwaysNetworkFirst(event.request));
        return;
    }
    
    // Estrategia para recursos externos
    if (isExternalResource(url)) {
        event.respondWith(networkFirstWithFallback(event.request));
        return;
    }
    
    // Para otros recursos, usar estrategia de red
    event.respondWith(fetch(event.request));
});

// ==========================================
// Estrategias de Caché
// ==========================================

// Estrategia: Siempre red primero (para archivos locales en desarrollo)
async function alwaysNetworkFirst(request) {
    try {
        console.log('🌐 Intentando red para:', request.url);
        
        // Crear request con headers anti-caché
        const networkRequest = new Request(request.url, {
            method: request.method,
            headers: {
                ...request.headers,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        const response = await fetch(networkRequest, {
            cache: 'no-store'
        });
        
        if (response.ok) {
            console.log('✅ Respuesta exitosa de red:', request.url);
            return response;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
        
    } catch (error) {
        console.log('❌ Error de red, intentando caché:', request.url, error.message);
        
        // Intentar desde caché como último recurso
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Sirviendo desde caché:', request.url);
            return cachedResponse;
        }
        
        // Si no hay caché, devolver error
        console.log('💥 No se pudo obtener recurso:', request.url);
        return new Response('Recurso no disponible offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Estrategia: Red primero con fallback a caché
async function networkFirstWithFallback(request) {
    try {
        console.log('🌐 Intentando red para recurso externo:', request.url);
        
        // Agregar timestamp para evitar caché del navegador
        const urlWithTimestamp = new URL(request.url);
        urlWithTimestamp.searchParams.set('v', Date.now());
        
        const response = await fetch(urlWithTimestamp, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (response.ok) {
            console.log('✅ Recurso externo obtenido:', request.url);
            
            // Guardar en caché para uso offline
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
            
            return response;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
        
    } catch (error) {
        console.log('❌ Error de red para recurso externo:', request.url);
        
        // Intentar desde caché
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Sirviendo recurso externo desde caché:', request.url);
            return cachedResponse;
        }
        
        // Fallback genérico
        console.log('💥 Recurso externo no disponible:', request.url);
        return new Response('Recurso externo no disponible', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// ==========================================
// Utilidades
// ==========================================

// Verificar si es un archivo local
function isLocalFile(url) {
    return url.hostname === self.location.hostname || 
           url.hostname === 'localhost' ||
           url.protocol === 'file:';
}

// Verificar si es un recurso externo crítico
function isExternalResource(url) {
    const externalHosts = [
        'unpkg.com',
        'cdnjs.cloudflare.com',
        'tile.openstreetmap.org',
        'server.arcgisonline.com',
        'basemaps.cartocdn.com'
    ];
    
    return externalHosts.some(host => url.hostname.includes(host));
}

// ==========================================
// Manejo de Mensajes
// ==========================================
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            console.log('🔄 Saltando espera del Service Worker');
            self.skipWaiting();
            break;
            
        case 'CLEAR_CACHE':
            console.log('🗑️ Limpiando caché por solicitud');
            clearAllCaches();
            break;
            
        case 'GET_CACHE_STATUS':
            console.log('📊 Enviando estado del caché');
            getCacheStatus().then(status => {
                event.ports[0].postMessage({ type: 'CACHE_STATUS', payload: status });
            });
            break;
            
        default:
            console.log('❓ Mensaje desconocido:', type);
    }
});

// ==========================================
// Funciones de Utilidad para Mensajes
// ==========================================

async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Todos los cachés limpiados');
    } catch (error) {
        console.error('❌ Error limpiando cachés:', error);
    }
}

async function getCacheStatus() {
    try {
        const cacheNames = await caches.keys();
        const status = {
            cacheCount: cacheNames.length,
            cacheNames: cacheNames,
            timestamp: Date.now()
        };
        
        // Obtener tamaño aproximado de cada caché
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            status[cacheName] = {
                keyCount: keys.length,
                urls: keys.map(request => request.url)
            };
        }
        
        return status;
    } catch (error) {
        console.error('❌ Error obteniendo estado del caché:', error);
        return { error: error.message };
    }
}

// ==========================================
// Manejo de Errores
// ==========================================
self.addEventListener('error', (event) => {
    console.error('❌ Error en Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rechazada en Service Worker:', event.reason);
});

// ==========================================
// Notificaciones Push (Preparado para futuro)
// ==========================================
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-96x96.png',
            vibrate: [100, 50, 100],
            data: data.data,
            actions: [
                {
                    action: 'explore',
                    title: 'Ver en el mapa',
                    icon: '/icons/icon-96x96.png'
                },
                {
                    action: 'close',
                    title: 'Cerrar',
                    icon: '/icons/icon-96x96.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// ==========================================
// Manejo de Clics en Notificaciones
// ==========================================
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// ==========================================
// Log de Inicialización
// ==========================================
console.log('🚀 Service Worker iniciado - Mapa de Puerres');
console.log('📅 Versión:', CACHE_NAME);
console.log('🌐 Modo:', 'DESARROLLO');
console.log('⚡ Estrategia: Red Primero');
