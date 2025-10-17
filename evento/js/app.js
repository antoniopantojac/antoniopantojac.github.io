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
    
    // Configurar limpieza de caché
    setupCacheClearing();
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
                    
                    // Verificar actualizaciones
                    checkForUpdates(registration);
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

    // Escuchar cuando la app se instala
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA instalada exitosamente');
        isInstalled = true;
        
        // Ocultar botón de instalación
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });
}

// ==========================================
// Verificación de Actualizaciones
// ==========================================
function checkForUpdates(registration) {
    // Escuchar cambios en el Service Worker
    registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                console.log('🔄 Nueva versión disponible');
                showUpdateNotification();
            }
        });
    });
    
    // Verificar periódicamente si hay Service Workers esperando
    setInterval(() => {
        if (registration.waiting) {
            console.log('🔄 Service Worker esperando activación');
            showUpdateNotification();
        }
    }, 5000);
}

// ==========================================
// Notificación de Actualización
// ==========================================
function showUpdateNotification() {
    // Crear notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-sync-alt"></i>
        <span>Nueva versión disponible</span>
        <button id="updateBtn" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        ">Actualizar</button>
        <button id="closeUpdateBtn" style="
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: 5px;
        ">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Botón de actualizar
    document.getElementById('updateBtn').addEventListener('click', () => {
        // Forzar actualización
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Recargar página
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
    
    // Botón de cerrar
    document.getElementById('closeUpdateBtn').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-cerrar después de 10 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 10000);
}

// ==========================================
// Estado Online/Offline
// ==========================================
function setupOnlineStatus() {
    const onlineStatus = document.getElementById('onlineStatus');
    
    function updateOnlineStatus() {
        if (onlineStatus) {
            if (navigator.onLine) {
                onlineStatus.innerHTML = '<i class="fas fa-wifi"></i><span>En línea</span>';
                onlineStatus.className = 'online-status';
            } else {
                onlineStatus.innerHTML = '<i class="fas fa-wifi-slash"></i><span>Sin conexión</span>';
                onlineStatus.className = 'online-status offline';
            }
        }
    }
    
    // Actualizar estado inicial
    updateOnlineStatus();
    
    // Escuchar cambios de conectividad
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Verificar conectividad periódicamente
    setInterval(() => {
        // Hacer ping a un servicio confiable
        fetch('https://www.google.com/favicon.ico', { 
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
        }).then(() => {
            if (!navigator.onLine) {
                // Forzar actualización del estado
                updateOnlineStatus();
            }
        }).catch(() => {
            // Conexión perdida
            if (navigator.onLine) {
                updateOnlineStatus();
            }
        });
    }, 30000); // Cada 30 segundos
}

// ==========================================
// Limpieza de Caché
// ==========================================
function setupCacheClearing() {
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', async () => {
            try {
                // Limpiar Service Worker cache
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(
                        cacheNames.map(cacheName => caches.delete(cacheName))
                    );
                    console.log('✅ Cachés del Service Worker limpiados');
                }
                
                // Limpiar localStorage
                localStorage.clear();
                console.log('✅ localStorage limpiado');
                
                // Limpiar sessionStorage
                sessionStorage.clear();
                console.log('✅ sessionStorage limpiado');
                
                // Mostrar mensaje de confirmación
                showMessage('Caché limpiado exitosamente', 'success');
                
                // Recargar página después de un breve delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } catch (error) {
                console.error('❌ Error limpiando caché:', error);
                showMessage('Error al limpiar caché', 'error');
            }
        });
    }
}

// ==========================================
// Animaciones
// ==========================================
function setupAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    document.addEventListener('DOMContentLoaded', () => {
        const animatableElements = document.querySelectorAll('.control-btn, .edit-btn, .simple-scale');
        animatableElements.forEach(el => {
            observer.observe(el);
        });
    });
}

// ==========================================
// Mensajes al Usuario
// ==========================================
function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: fadeIn 0.3s ease;
        max-width: 300px;
        text-align: center;
    `;
    
    messageEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
        <span style="margin-left: 8px;">${message}</span>
    `;
    
    document.body.appendChild(messageEl);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        messageEl.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 300);
    }, 3000);
}

// ==========================================
// Manejo de Errores Globales
// ==========================================
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    
    // No mostrar errores de red en producción
    if (event.error && event.error.name === 'NetworkError') {
        return;
    }
    
    // Mostrar error crítico al usuario
    if (event.error && event.error.message) {
        showMessage('Error inesperado. Recarga la página.', 'error');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada:', event.reason);
    
    // Prevenir que aparezca en la consola
    event.preventDefault();
    
    // Mostrar mensaje al usuario
    showMessage('Error de conexión. Verifica tu internet.', 'error');
});

// ==========================================
// Optimización de Rendimiento
// ==========================================
// Lazy loading de imágenes
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ==========================================
// Prevención de Zoom en iOS
// ==========================================
document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ==========================================
// Configuración de Viewport Dinámico
// ==========================================
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Establecer altura del viewport
setViewportHeight();

// Actualizar en resize
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
});

// ==========================================
// Utilidades
// ==========================================

// Función para copiar al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showMessage('Copiado al portapapeles', 'success');
    } catch (err) {
        console.error('Error copiando al portapapeles:', err);
        showMessage('Error al copiar', 'error');
    }
}

// Función para compartir (si está disponible)
async function shareContent(title, text, url) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: text,
                url: url
            });
        } catch (err) {
            console.log('Error compartiendo:', err);
        }
    } else {
        // Fallback: copiar URL
        copyToClipboard(url);
    }
}

// Función para vibrar (si está disponible)
function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// ==========================================
// Exportar funciones globales
// ==========================================
window.showMessage = showMessage;
window.copyToClipboard = copyToClipboard;
window.shareContent = shareContent;
window.vibrate = vibrate;
