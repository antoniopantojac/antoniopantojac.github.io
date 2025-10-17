// ==========================================
// Aplicación Principal PWA
// ==========================================

let deferredPrompt;
let isInstalled = false;

// ==========================================
// Inicialización
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Configurar PWA
    setupPWA();
    
    // Configurar estado online/offline
    setupOnlineStatus();
    
    // Animaciones de entrada
    setupAnimations();
});

// ==========================================
// Configuración PWA
// ==========================================
function setupPWA() {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('✅ Service Worker registrado:', registration.scope);
                })
                .catch(error => {
                    console.log('❌ Error al registrar Service Worker:', error);
                });
        });
    }

    // Escuchar evento de instalación
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir el prompt automático
        e.preventDefault();
        
        // Guardar el evento para usarlo después
        deferredPrompt = e;
        
        // Mostrar el botón de instalación
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.style.display = 'flex';
        }
    });

    // Botón de instalación
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) {
                return;
            }

            // Mostrar el prompt de instalación
            deferredPrompt.prompt();

            // Esperar la respuesta del usuario
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);

            // Limpiar el prompt
            deferredPrompt = null;
            
            // Ocultar el botón
            installBtn.style.display = 'none';
        });
    }

    // Botón de limpiar caché
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', async () => {
            if ('serviceWorker' in navigator && 'caches' in window) {
                try {
                    // Limpiar todos los cachés
                    const cacheNames = await caches.keys();
                    await Promise.all(
                        cacheNames.map(cacheName => caches.delete(cacheName))
                    );
                    
                    // Enviar mensaje al service worker para limpiar caché
                    if (navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({
                            type: 'CLEAR_CACHE'
                        });
                    }
                    
                    // Recargar la página
                    window.location.reload();
                    
                    console.log('✅ Caché limpiado exitosamente');
                } catch (error) {
                    console.error('❌ Error al limpiar caché:', error);
                    alert('Error al limpiar el caché. Intenta recargar la página manualmente.');
                }
            } else {
                // Fallback: solo recargar la página
                window.location.reload();
            }
        });
    }

    // Detectar cuando la app está instalada
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA instalada correctamente');
        isInstalled = true;
        
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });

    // Detectar si ya está instalada (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
        isInstalled = true;
        console.log('🎉 La app está corriendo en modo standalone');
    }

    // Mostrar botón de limpiar caché si hay service worker
    if ('serviceWorker' in navigator) {
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        if (clearCacheBtn) {
            clearCacheBtn.style.display = 'flex';
        }
        
        // Escuchar mensajes del Service Worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SW_UPDATED') {
                console.log('🔄 Service Worker actualizado:', event.data.message);
                // Recargar automáticamente después de un breve delay
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        });
        
        // Verificar si hay una nueva versión del Service Worker
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🎯 Nuevo Service Worker activado, recargando...');
            window.location.reload();
        });
        
        // Verificar periódicamente si hay actualizaciones del Service Worker
        setInterval(() => {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration && registration.waiting) {
                    console.log('🔄 Service Worker esperando activación, forzando...');
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
            });
        }, 5000); // Verificar cada 5 segundos
    }
}

// ==========================================
// Estado de Conexión
// ==========================================
function setupOnlineStatus() {
    const statusBadge = document.getElementById('onlineStatus');
    
    function updateOnlineStatus() {
        if (!statusBadge) return;
        
        if (navigator.onLine) {
            statusBadge.className = 'status-badge online';
            statusBadge.innerHTML = `
                <i class="fas fa-wifi"></i>
                <span>En línea</span>
            `;
        } else {
            statusBadge.className = 'status-badge offline';
            statusBadge.innerHTML = `
                <i class="fas fa-wifi"></i>
                <span>Sin conexión</span>
            `;
        }
    }

    // Actualizar al cargar
    updateOnlineStatus();

    // Escuchar cambios de conexión
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// ==========================================
// Animaciones
// ==========================================
function setupAnimations() {
    // Intersection Observer para animaciones al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observar elementos animables
    const animatedElements = document.querySelectorAll('.info-card, .legend, .info-panel');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// Utilidades
// ==========================================

// Compartir la ubicación
function shareLocation() {
    if (navigator.share) {
        navigator.share({
            title: 'Mapa de Puerres',
            text: 'Mapa interactivo de Puerres, Nariño, Colombia',
            url: window.location.href
        })
        .then(() => console.log('Compartido exitosamente'))
        .catch(error => console.log('Error al compartir:', error));
    }
}

// Detectar si está en iOS
function isIOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

// Detectar si está en Android
function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

// Log de información del dispositivo
console.log('📱 Información del dispositivo:');
console.log('- iOS:', isIOS());
console.log('- Android:', isAndroid());
console.log('- Online:', navigator.onLine);
console.log('- Service Worker soportado:', 'serviceWorker' in navigator);
console.log('- Modo standalone:', window.matchMedia('(display-mode: standalone)').matches);

// ==========================================
// Manejo de errores global
// ==========================================
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada:', e.reason);
});

// ==========================================
// Exportar funciones útiles
// ==========================================
window.app = {
    shareLocation,
    isIOS,
    isAndroid,
    isInstalled: () => isInstalled
};


