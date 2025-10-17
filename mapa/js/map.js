// ==========================================
// Configuración del Mapa de Puerres
// ==========================================

// Coordenadas de Puerres, Nariño, Colombia
const PUERRES_CENTER = [0.883159, -77.504078]; // Lat, Lng
const DEFAULT_ZOOM = 15;

// ==========================================
// Puntos de Interés
// ==========================================
const pointsOfInterest = [
    {
        id: 'townhall',
        coords: [0.883200, -77.504000],
        nameKey: 'townHall',
        descKey: 'townHallDesc',
        icon: 'building',
        color: '#e74c3c',
        whatsapp: '3001234567'
    },
    {
        id: 'church',
        coords: [0.883100, -77.504100],
        nameKey: 'church',
        descKey: 'churchDesc',
        icon: 'church',
        color: '#9b59b6',
        whatsapp: '3009876543'
    },
    {
        id: 'park',
        coords: [0.883300, -77.504150],
        nameKey: 'park',
        descKey: 'parkDesc',
        icon: 'tree',
        color: '#27ae60',
        whatsapp: '3005555555'
    },
    {
        id: 'health',
        coords: [0.883000, -77.503950],
        nameKey: 'healthCenter',
        descKey: 'healthCenterDesc',
        icon: 'hospital',
        color: '#e67e22',
        whatsapp: '3001111111'
    },
    {
        id: 'school',
        coords: [0.883250, -77.504200],
        nameKey: 'school',
        descKey: 'schoolDesc',
        icon: 'graduation-cap',
        color: '#3498db',
        whatsapp: '3002222222'
    },
    {
        id: 'police',
        coords: [0.883350, -77.504050],
        nameKey: 'policeStation',
        descKey: 'policeStationDesc',
        icon: 'shield-alt',
        color: '#2c3e50',
        whatsapp: '3003333333'
    }
];

// ==========================================
// Clase del Mapa
// ==========================================
class PuerresMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.userMarker = null;
        this.editMode = false;
        this.selectedMarker = null;
        this.originalPositions = {};
        this.addingMode = false;
        this.currentTab = 'edit';
        this.iconGallery = null;
        this.storageKey = 'puerres_map_pois';
        this.mapLayers = {};
        this.currentLayer = null;
        this.availableIcons = {
            // Alojamiento
            hotel: 'fas fa-bed',
            hostel: 'fas fa-home',
            camping: 'fas fa-campground',
            cabin: 'fas fa-home',
            
            // Alimentación
            restaurant: 'fas fa-utensils',
            cafe: 'fas fa-coffee',
            bar: 'fas fa-wine-glass-alt',
            bakery: 'fas fa-birthday-cake',
            market: 'fas fa-shopping-cart',
            food_truck: 'fas fa-truck',
            
            // Comercio
            shop: 'fas fa-store',
            supermarket: 'fas fa-shopping-basket',
            pharmacy: 'fas fa-pills',
            clothing: 'fas fa-tshirt',
            electronics: 'fas fa-laptop',
            bookstore: 'fas fa-book',
            
            // Servicios de Salud
            hospital: 'fas fa-hospital',
            clinic: 'fas fa-clinic-medical',
            dentist: 'fas fa-tooth',
            veterinary: 'fas fa-paw',
            
            // Educación
            school: 'fas fa-graduation-cap',
            university: 'fas fa-university',
            library: 'fas fa-book-open',
            museum: 'fas fa-landmark',
            
            // Lugares Religiosos
            church: 'fas fa-church',
            cathedral: 'fas fa-church',
            chapel: 'fas fa-church',
            mosque: 'fas fa-mosque',
            temple: 'fas fa-torii-gate',
            
            // Espacios Públicos
            park: 'fas fa-tree',
            plaza: 'fas fa-map-signs',
            beach: 'fas fa-umbrella-beach',
            stadium: 'fas fa-football-ball',
            gym: 'fas fa-dumbbell',
            
            // Transporte
            gas_station: 'fas fa-gas-pump',
            parking: 'fas fa-parking',
            bus_station: 'fas fa-bus',
            airport: 'fas fa-plane',
            taxi: 'fas fa-taxi',
            
            // Servicios Financieros
            bank: 'fas fa-university',
            atm: 'fas fa-credit-card',
            money_exchange: 'fas fa-exchange-alt',
            
            // Entretenimiento
            cinema: 'fas fa-film',
            theater: 'fas fa-theater-masks',
            casino: 'fas fa-dice',
            arcade: 'fas fa-gamepad',
            nightclub: 'fas fa-music',
            
            // Servicios Públicos
            town_hall: 'fas fa-landmark',
            police: 'fas fa-shield-alt',
            fire_station: 'fas fa-fire-extinguisher',
            post_office: 'fas fa-mail-bulk',
            
            // Industria
            factory: 'fas fa-industry',
            warehouse: 'fas fa-warehouse',
            office: 'fas fa-building',
            
            // Turismo
            viewpoint: 'fas fa-binoculars',
            waterfall: 'fas fa-water',
            mountain: 'fas fa-mountain',
            lake: 'fas fa-swimmer',
            river: 'fas fa-water',
            
            // Servicios
            mechanic: 'fas fa-wrench',
            beauty_salon: 'fas fa-cut',
            barber: 'fas fa-cut',
            laundry: 'fas fa-tshirt',
            repair: 'fas fa-tools',
            
            // Residencial
            house: 'fas fa-home',
            apartment: 'fas fa-building',
            neighborhood: 'fas fa-map-marked-alt',
            
            // Otros
            landmark: 'fas fa-monument',
            bridge: 'fas fa-bridge',
            tunnel: 'fas fa-road',
            border: 'fas fa-flag',
            other: 'fas fa-map-marker-alt'
        };
    }

    init() {
        // Crear el mapa
        this.map = L.map('map', {
            center: PUERRES_CENTER,
            zoom: DEFAULT_ZOOM,
            zoomControl: true
        });

        // Configurar capas de mapas base
        this.setupMapLayers();

        // Añadir capa por defecto (OpenStreetMap)
        this.currentLayer = this.mapLayers.osm;
        this.currentLayer.addTo(this.map);

        // Añadir escala sencilla
        this.addSimpleScale();

        // Cargar POIs guardados (incluye originales y personalizados)
        this.loadSavedPOIs();

        // Configurar controles
        this.setupControls();
        
        // Hacer función de diagnóstico disponible globalmente
        window.diagnosticarGuardado = () => this.diagnosticarGuardado();


        // Ocultar loading
        setTimeout(() => {
            const loading = document.getElementById('loading');
            if (loading) {
                loading.style.display = 'none';
            }
        }, 1000);
    }

    addPointsOfInterest() {
        pointsOfInterest.forEach(poi => {
            // Crear icono personalizado
            const iconHtml = `
                <div style="
                    background-color: ${poi.color};
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                ">
                    <i class="fas fa-${poi.icon}" style="color: white; font-size: 18px;"></i>
                </div>
            `;

            const icon = L.divIcon({
                html: iconHtml,
                className: 'custom-poi-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            // Crear marcador
            const marker = L.marker(poi.coords, { icon })
                .addTo(this.map);

            // Guardar referencia al POI en el marcador con estructura completa
            marker.poiData = {
                ...poi,
                coords: poi.coords,
                icon: `fas fa-${poi.icon}`,
                color: poi.color
            };

            // Añadir popup
            this.updateMarkerPopup(marker);

            this.markers.push(marker);
        });
    }

    updateMarkerPopup(marker) {
        const poi = marker.poiData;
        
        // Determinar nombre y descripción
        let name, desc;
        
        // Usar siempre los nombres y descripciones directas
        name = poi.name || 'Punto de interés';
        desc = poi.description || 'Sin descripción';

        // Determinar icono
        const iconClass = poi.icon ? poi.icon : `fas fa-${poi.icon}`;
        const iconColor = poi.color || '#3498db';

        // Formatear número de WhatsApp
        let whatsappInfo = '';
        if (poi.whatsapp) {
            const formattedWhatsapp = poi.whatsapp.replace(/\D/g, ''); // Solo números
            const colombianWhatsapp = formattedWhatsapp.startsWith('57') ? 
                `+${formattedWhatsapp}` : 
                `+57${formattedWhatsapp}`;
            
            whatsappInfo = `
                <div style="margin-top: 10px; padding: 8px; background: #25D366; border-radius: 6px; text-align: center;">
                    <a href="https://wa.me/${colombianWhatsapp.replace('+', '')}" 
                       target="_blank" 
                       style="color: white; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 5px;">
                        <i class="fab fa-whatsapp"></i>
                        <span>${colombianWhatsapp}</span>
                    </a>
                </div>
            `;
        }

        const popupContent = `
            <div class="popup-content">
                <div class="popup-icon">
                    <i class="${iconClass}" style="color: ${iconColor};"></i>
                </div>
                <h3>${name}</h3>
                <p>${desc}</p>
                ${whatsappInfo}
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 280,
            className: 'custom-popup'
        });
    }


    setupControls() {
        // Botón de localización
        const locateBtn = document.getElementById('locateBtn');
        if (locateBtn) {
            locateBtn.addEventListener('click', () => {
                this.locateUser();
            });
        }

        // Botón de reset
        const resetBtn = document.getElementById('resetViewBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetView();
            });
        }

        // Botón de modo edición
        const editBtn = document.getElementById('editModeBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.toggleEditMode();
            });
        }

        // Configurar panel de edición
        this.setupEditPanel();

        // Selector de tipo de mapa
        this.setupMapTypeSelector();
    }

    setupMapTypeSelector() {
        const mapTypeBtn = document.getElementById('mapTypeBtn');
        const mapTypeMenu = document.getElementById('mapTypeMenu');

        if (mapTypeBtn && mapTypeMenu) {
            // Toggle del menú
            mapTypeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mapTypeMenu.style.display = mapTypeMenu.style.display === 'none' ? 'block' : 'none';
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', () => {
                mapTypeMenu.style.display = 'none';
            });

            // Prevenir cierre del menú al hacer clic dentro
            mapTypeMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Event listeners para las opciones
            const options = document.querySelectorAll('.map-type-option');
            options.forEach(option => {
                option.addEventListener('click', () => {
                    const layerType = option.getAttribute('data-type');
                    this.changeMapLayer(layerType);
                    mapTypeMenu.style.display = 'none';
                });
            });
        }
    }

    locateUser() {
        // Verificar si el navegador soporta geolocalización
        if (!navigator.geolocation) {
            this.showLocationError('geolocationNotSupported');
            return;
        }

        // Mostrar indicador de carga
        this.showLocationLoading();

        // Primero intentar con alta precisión
        this.tryGetLocation(true);
    }

    tryGetLocation(highAccuracy = true, attempt = 1) {
        const maxAttempts = 3;
        
        // Configurar opciones de geolocalización
        const options = {
            enableHighAccuracy: highAccuracy,
            timeout: highAccuracy ? 15000 : 8000, // Más tiempo para alta precisión
            maximumAge: highAccuracy ? 60000 : 300000 // 1 min para alta precisión, 5 min para baja
        };

        console.log(`Intento ${attempt}: ${highAccuracy ? 'Alta precisión' : 'Baja precisión'}`);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                this.hideLocationLoading();
                this.handleLocationSuccess(position);
            },
            (error) => {
                console.log(`Error en intento ${attempt}:`, error.message);
                
                // Si es el primer intento con alta precisión, probar con baja precisión
                if (highAccuracy && attempt === 1) {
                    console.log('Probando con baja precisión...');
                    this.tryGetLocation(false, 1);
                }
                // Si es el segundo intento con baja precisión, reintentar una vez más
                else if (!highAccuracy && attempt < maxAttempts) {
                    console.log(`Reintentando (${attempt + 1}/${maxAttempts})...`);
                    setTimeout(() => {
                        this.tryGetLocation(false, attempt + 1);
                    }, 2000);
                }
                // Si todos los intentos fallaron, intentar con IP
                else {
                    this.hideLocationLoading();
                    this.tryIPLocation(error);
                }
            },
            options
        );
    }

    handleLocationSuccess(position, isApproximate = false) {
                    const userCoords = [position.coords.latitude, position.coords.longitude];
                    
                    // Si ya existe un marcador de usuario, eliminarlo
                    if (this.userMarker) {
                        this.map.removeLayer(this.userMarker);
                    }

                    // Crear icono para ubicación del usuario
                    const userIcon = L.divIcon({
                        html: `
                            <div style="
                    background-color: ${isApproximate ? '#f39c12' : '#3498db'};
                    width: 25px;
                    height: 25px;
                                border-radius: 50%;
                                border: 3px solid white;
                    box-shadow: 0 3px 15px rgba(${isApproximate ? '243, 156, 18' : '52, 152, 219'}, 0.6);
                    animation: pulse 2s infinite;
                ">
                    <div style="
                        background-color: ${isApproximate ? '#f39c12' : '#3498db'};
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                            "></div>
                </div>
                        `,
                        className: 'user-location-marker',
            iconSize: [25, 25],
            iconAnchor: [12.5, 12.5]
        });

        // Crear círculo de precisión si es una ubicación aproximada
        let accuracyCircle = null;
        if (isApproximate && position.coords.accuracy > 1000) {
            accuracyCircle = L.circle(userCoords, {
                radius: position.coords.accuracy,
                color: '#f39c12',
                fillColor: '#f39c12',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5, 5'
            }).addTo(this.map);
        }

                    // Añadir marcador
                    this.userMarker = L.marker(userCoords, { icon })
                        .addTo(this.map)
            .bindPopup(`
                <div class="popup-content">
                    <h3>📍 Tu ubicación</h3>
                    <p>Lat: ${userCoords[0].toFixed(6)}<br>
                       Lng: ${userCoords[1].toFixed(6)}</p>
                    ${isApproximate ? '<p style="color: #f39c12; font-size: 12px;"><strong>⚠️ Ubicación aproximada</strong><br>Precisión: ~${Math.round(position.coords.accuracy/1000)}km</p>' : ''}
                </div>
            `);

        // Centrar en la ubicación con zoom apropiado
        const zoomLevel = isApproximate ? 12 : 16;
        this.map.setView(userCoords, zoomLevel);

        // Mostrar mensaje de éxito
        const successMessage = isApproximate ? 
            'Ubicación aproximada obtenida (por IP)' : 
            'Ubicación obtenida correctamente';
        this.showLocationMessage('success', successMessage);
    }

    tryIPLocation(originalError) {
        console.log('Intentando obtener ubicación por IP...');
        
        // Mostrar mensaje de que está intentando ubicación por IP
        this.showLocationLoading();
        
        // Usar un servicio de geolocalización por IP
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                this.hideLocationLoading();
                
                if (data.latitude && data.longitude) {
                    // Crear una posición simulada
                    const simulatedPosition = {
                        coords: {
                            latitude: data.latitude,
                            longitude: data.longitude,
                            accuracy: 5000 // Muy baja precisión para ubicación por IP
                        }
                    };
                    
                    this.handleLocationSuccess(simulatedPosition, true); // true indica que es aproximada
        } else {
                    this.handleLocationError(originalError, false, 3);
                }
            })
            .catch(error => {
                console.log('Error obteniendo ubicación por IP:', error);
                this.hideLocationLoading();
                this.handleLocationError(originalError, false, 3);
            });
    }

    handleLocationError(error, highAccuracy = true, attempt = 1) {
        console.error('Geolocation error:', error);
        
        let errorKey = 'locationError';
        let suggestions = [];
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorKey = 'locationPermissionDenied';
                suggestions = [
                    'Haz clic en el icono de ubicación en la barra de direcciones',
                    'Ve a Configuración > Privacidad > Ubicación',
                    'Asegúrate de que la ubicación esté habilitada para este sitio'
                ];
                break;
            case error.POSITION_UNAVAILABLE:
                errorKey = 'locationUnavailable';
                suggestions = [
                    'Verifica que el GPS esté activado en tu dispositivo',
                    'Sal al exterior para mejorar la señal GPS',
                    'Espera unos segundos y vuelve a intentar',
                    'Verifica tu conexión a Internet'
                ];
                break;
            case error.TIMEOUT:
                errorKey = 'locationTimeout';
                suggestions = [
                    'La ubicación está tardando más de lo normal',
                    'Verifica que tengas buena señal GPS',
                    'Intenta de nuevo en unos segundos'
                ];
                break;
            default:
                errorKey = 'locationError';
                suggestions = [
                    'Verifica que la ubicación esté habilitada',
                    'Intenta recargar la página',
                    'Verifica tu conexión a Internet'
                ];
        }
        
        this.showLocationError(errorKey, suggestions, attempt);
    }

    showLocationLoading() {
        // Crear o actualizar indicador de carga
        let loadingIndicator = document.querySelector('.location-loading');
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'location-loading';
            loadingIndicator.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px 30px;
                border-radius: 10px;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
            `;
            document.body.appendChild(loadingIndicator);
        }
        
        loadingIndicator.innerHTML = `
            <div style="
                width: 20px;
                height: 20px;
                border: 2px solid #ffffff;
                border-top: 2px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            Obteniendo ubicación...
        `;
        loadingIndicator.style.display = 'flex';
    }

    hideLocationLoading() {
        const loadingIndicator = document.querySelector('.location-loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    showLocationMessage(type, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `location-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    getErrorMessage(errorKey) {
        const messages = {
            'geolocationNotSupported': 'La geolocalización no es compatible con este navegador.',
            'locationPermissionDenied': 'Permiso de ubicación denegado. Por favor, permite el acceso a la ubicación.',
            'locationUnavailable': 'La ubicación no está disponible en este momento.',
            'locationTimeout': 'Tiempo de espera agotado al obtener la ubicación.',
            'locationError': 'Error al obtener la ubicación.'
        };
        return messages[errorKey] || 'Error desconocido al obtener la ubicación.';
    }

    showLocationError(errorKey, suggestions = [], attempt = 1) {
        const errorMessage = this.getErrorMessage(errorKey);
        
        // Crear mensaje de error más detallado
        const messageDiv = document.createElement('div');
        messageDiv.className = 'location-error-dialog';
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 400px;
            width: 90%;
            text-align: center;
        `;
        
        messageDiv.innerHTML = `
            <div style="color: #e74c3c; font-size: 48px; margin-bottom: 15px;">📍</div>
            <h3 style="color: #2c3e50; margin-bottom: 15px; font-size: 18px;">${errorMessage}</h3>
            ${suggestions.length > 0 ? `
                <div style="text-align: left; margin: 20px 0; color: #7f8c8d;">
                    <strong>Sugerencias:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        ${suggestions.map(suggestion => `<li style="margin: 5px 0;">${suggestion}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button id="retryLocation" style="
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                ">Intentar de nuevo</button>
                <button id="closeLocationError" style="
                    background: #95a5a6;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Event listeners para los botones
        document.getElementById('retryLocation').addEventListener('click', () => {
            document.body.removeChild(messageDiv);
            this.locateUser(); // Reiniciar el proceso
        });
        
        document.getElementById('closeLocationError').addEventListener('click', () => {
            document.body.removeChild(messageDiv);
        });
        
        // También mostrar en consola para debugging
        console.error('Location error:', errorMessage);
        console.log('Suggestions:', suggestions);
    }

    resetView() {
        this.map.setView(PUERRES_CENTER, DEFAULT_ZOOM);
    }

    // ==========================================
    // Funciones de Edición
    // ==========================================

    toggleEditMode() {
        if (!this.editMode) {
            // Si no está en modo edición, pedir autenticación
            this.showAuthModal();
        } else {
            // Si ya está en modo edición, desactivarlo
            this.disableEditMode();
        }
    }

    closeEditMode() {
        // Cerrar directamente sin pedir autenticación
        this.disableEditMode();
        
        // Ocultar panel
        const editPanel = document.getElementById('editPanel');
        if (editPanel) {
            editPanel.style.display = 'none';
            editPanel.classList.remove('minimized');
        }
    }

    togglePanelMinimize() {
        const editPanel = document.getElementById('editPanel');
        const minimizeBtn = document.getElementById('minimizePanel');
        
        if (editPanel && minimizeBtn) {
            if (editPanel.classList.contains('minimized')) {
                // Expandir panel
                editPanel.classList.remove('minimized');
                minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
                minimizeBtn.title = 'Minimizar panel';
            } else {
                // Minimizar panel
                editPanel.classList.add('minimized');
                minimizeBtn.innerHTML = '<i class="fas fa-plus"></i>';
                minimizeBtn.title = 'Expandir panel';
            }
        }
    }

    showAuthModal() {
        const authModal = document.getElementById('authModal');
        authModal.style.display = 'flex';
        
        // Limpiar campos
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('authError').classList.remove('show');
        
        // Enfocar en el campo de usuario
        document.getElementById('username').focus();
    }

    hideAuthModal() {
        const authModal = document.getElementById('authModal');
        authModal.style.display = 'none';
    }

    authenticateUser(username, password) {
        // Credenciales correctas
        const correctUsername = 'ciase';
        const correctPassword = 'ciase123';
        
        return username === correctUsername && password === correctPassword;
    }

    handleAuthSuccess() {
        this.hideAuthModal();
        this.editMode = true;
        
        const editBtn = document.getElementById('editModeBtn');
        const editPanel = document.getElementById('editPanel');
        
        // Activar modo edición
        editBtn.classList.add('active');
        editPanel.style.display = 'block';
        this.enableEditMode();
    }

    handleAuthError() {
        const authError = document.getElementById('authError');
        authError.classList.add('show');
        
        // Limpiar contraseña
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }

    enableEditMode() {
        // Guardar posiciones originales
        this.originalPositions = {};
        this.markers.forEach(marker => {
            this.originalPositions[marker.poiData.id] = marker.getLatLng();
        });

        // Hacer marcadores arrastrables y seleccionables
        this.markers.forEach(marker => {
            marker.dragging.enable();
            marker.getElement().classList.add('marker-editable');
            
            // Remover popup temporalmente
            marker.unbindPopup();
            
            // Agregar evento de click para seleccionar
            marker.on('click', () => {
                this.selectMarker(marker);
            });

            // Agregar evento de drag para actualizar coordenadas en tiempo real
            marker.on('drag', () => {
                this.updateCoordinatesDisplay(marker);
            });

            // Agregar evento de dragend para guardar cambios
            marker.on('dragend', () => {
                const coords = marker.getLatLng();
                
                // Actualizar coordenadas en los datos del POI
                marker.poiData.coords = [coords.lat, coords.lng];
                
                // Actualizar display si es el marcador seleccionado
                this.updateCoordinatesDisplay(marker);
                
                // Guardar cambios automáticamente
                this.savePOIsToStorage();
                
                // Mostrar mensaje de confirmación
                this.showLocationMessage('success', 'Ubicación actualizada y guardada');
                
                console.log('POI movido y guardado:', marker.poiData);
            });
        });
    }

    disableEditMode() {
        this.editMode = false;
        
        // Restaurar comportamiento normal
        this.markers.forEach(marker => {
            marker.dragging.disable();
            marker.getElement().classList.remove('marker-editable', 'marker-selected');
            
            // Restaurar popup
            this.updateMarkerPopup(marker);
            
            // Remover eventos de edición
            marker.off('click');
            marker.off('drag');
            marker.off('dragend');
        });

        // Limpiar selección
        this.selectedMarker = null;
        this.hideSelectedPOI();
        
        // Remover clase active del botón
        const editBtn = document.getElementById('editModeBtn');
        if (editBtn) {
            editBtn.classList.remove('active');
        }
        
        // Cancelar modo de agregar si está activo
        if (this.addingMode) {
            this.cancelAddingPOI();
        }
    }

    selectMarker(marker) {
        // Deseleccionar marcador anterior
        if (this.selectedMarker && this.selectedMarker !== marker) {
            this.selectedMarker.getElement().classList.remove('marker-selected');
        }

        // Seleccionar nuevo marcador
        this.selectedMarker = marker;
        marker.getElement().classList.add('marker-selected');
        
        // Mostrar panel de edición
        this.showSelectedPOI(marker);
    }

    showSelectedPOI(marker) {
        const selectedPOI = document.getElementById('selectedPOI');
        const selectedPOIName = document.getElementById('selectedPOIName');
        const poiName = document.getElementById('poiName');
        const poiDescription = document.getElementById('poiDescription');
        const poiWhatsapp = document.getElementById('poiWhatsapp');
        const poiLat = document.getElementById('poiLat');
        const poiLng = document.getElementById('poiLng');
        const iconPreview = document.getElementById('selectedIcon');

        // Mostrar nombre
        const displayName = marker.poiData.name || 'Punto de interés';
        
        selectedPOIName.textContent = displayName;
        
        // Llenar campos del formulario
        poiName.value = marker.poiData.name || '';
        poiDescription.value = marker.poiData.description || '';
        poiWhatsapp.value = marker.poiData.whatsapp || '';
        poiLat.value = marker.getLatLng().lat;
        poiLng.value = marker.getLatLng().lng;

        // Mostrar preview del icono
        if (iconPreview && marker.poiData.icon) {
            iconPreview.innerHTML = `<i class="${marker.poiData.icon}"></i>`;
        }

        selectedPOI.style.display = 'block';
    }

    hideSelectedPOI() {
        const selectedPOI = document.getElementById('selectedPOI');
        selectedPOI.style.display = 'none';
    }

    updateCoordinatesDisplay(marker) {
        if (this.selectedMarker === marker) {
            const poiLat = document.getElementById('poiLat');
            const poiLng = document.getElementById('poiLng');
            
            if (poiLat && poiLng) {
                poiLat.value = marker.getLatLng().lat;
                poiLng.value = marker.getLatLng().lng;
            }
        }
    }


    setupEditPanel() {
        // Botón cerrar panel
        const closeBtn = document.getElementById('closeEditPanel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeEditMode();
            });
        }

        // Botón minimizar panel
        const minimizeBtn = document.getElementById('minimizePanel');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                this.togglePanelMinimize();
            });
        }

        // Configurar tabs
        this.setupTabs();

        // Configurar formularios de edición
        this.setupEditForm();

        // Configurar formulario de agregar
        this.setupAddForm();

        // Configurar galería de iconos
        this.setupIconGallery();

        // Configurar modal de autenticación
        this.setupAuthModal();
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Remover clase active de todos los tabs
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Activar tab seleccionado
                btn.classList.add('active');
                document.getElementById(`tab-${targetTab}`).classList.add('active');
                this.currentTab = targetTab;

                // Actualizar lista de POIs si es necesario
                if (targetTab === 'manage') {
                    this.updatePOIList();
                }
            });
        });

    }

    setupEditForm() {
        // Botón actualizar POI
        const updateBtn = document.getElementById('updatePOI');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                this.updatePOI();
            });
        }

        // Botón eliminar POI
        const deleteBtn = document.getElementById('deletePOI');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deletePOI();
            });
        }

        // Botón cancelar edición
        const cancelBtn = document.getElementById('cancelEdit');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelPOIEdit();
            });
        }

        // Botón cambiar icono
        const changeIconBtn = document.getElementById('changeIcon');
        if (changeIconBtn) {
            changeIconBtn.addEventListener('click', () => {
                this.showIconGallery();
            });
        }


        // Inputs de coordenadas
        const poiLat = document.getElementById('poiLat');
        const poiLng = document.getElementById('poiLng');
        
        if (poiLat) {
            poiLat.addEventListener('input', () => {
                if (this.selectedMarker) {
                    this.updateMarkerFromInputs();
                }
            });
        }
        
        if (poiLng) {
            poiLng.addEventListener('input', () => {
                if (this.selectedMarker) {
                    this.updateMarkerFromInputs();
                }
            });
        }
    }

    setupAddForm() {
        // Botón agregar nuevo POI en el mapa
        const addBtn = document.getElementById('addNewPOI');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startAddingPOI();
            });
        }

        // Botón agregar nuevo POI por coordenadas
        const addCoordsBtn = document.getElementById('addNewPOICoords');
        if (addCoordsBtn) {
            addCoordsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addPOIByCoordinates();
            });
        }

        // Botón cancelar agregar
        const cancelAddBtn = document.getElementById('cancelAdd');
        if (cancelAddBtn) {
            cancelAddBtn.addEventListener('click', () => {
                this.cancelAddingPOI();
            });
        }

        // Checkbox para usar coordenadas
        const useCoordinatesCheckbox = document.getElementById('useCoordinates');
        if (useCoordinatesCheckbox) {
            useCoordinatesCheckbox.addEventListener('change', () => {
                this.toggleCoordinatesMode();
            });
        }

        // Validar formulario de agregar
        const nameInput = document.getElementById('newPoiName');
        const descInput = document.getElementById('newPoiDescription');
        const whatsappInput = document.getElementById('newPoiWhatsapp');
        const latInput = document.getElementById('newPoiLat');
        const lngInput = document.getElementById('newPoiLng');

        if (nameInput) {
            nameInput.addEventListener('input', () => {
                this.validateAddForm();
            });
        }

        if (descInput) {
            descInput.addEventListener('input', () => {
                this.validateAddForm();
            });
        }

        if (whatsappInput) {
            whatsappInput.addEventListener('input', () => {
                this.validateAddForm();
            });
        }

        if (latInput) {
            latInput.addEventListener('input', () => {
                this.validateAddForm();
            });
        }

        if (lngInput) {
            lngInput.addEventListener('input', () => {
                this.validateAddForm();
            });
        }

        // Validación inicial
        this.validateAddForm();
    }

    setupIconGallery() {
        // Botón cerrar galería
        const closeGalleryBtn = document.getElementById('closeIconGallery');
        if (closeGalleryBtn) {
            closeGalleryBtn.addEventListener('click', () => {
                this.hideIconGallery();
            });
        }

        // Cerrar galería al hacer clic fuera
        const gallery = document.getElementById('iconGallery');
        if (gallery) {
            gallery.addEventListener('click', (e) => {
                if (e.target === gallery) {
                    this.hideIconGallery();
                }
            });
        }

        // Llenar galería de iconos
        this.populateIconGallery();
    }

    setupAuthModal() {
        // Formulario de autenticación
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                if (this.authenticateUser(username, password)) {
                    this.handleAuthSuccess();
                } else {
                    this.handleAuthError();
                }
            });
        }

        // Botón cancelar autenticación
        const cancelAuth = document.getElementById('cancelAuth');
        if (cancelAuth) {
            cancelAuth.addEventListener('click', () => {
                this.hideAuthModal();
            });
        }

        // Cerrar modal al hacer clic fuera
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    this.hideAuthModal();
                }
            });
        }

        // Manejar Enter en los campos
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (usernameInput) {
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    passwordInput.focus();
                }
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    authForm.dispatchEvent(new Event('submit'));
                }
            });
        }
    }

    updateMarkerFromInputs() {
        const poiLat = document.getElementById('poiLat');
        const poiLng = document.getElementById('poiLng');
        
        if (poiLat && poiLng && this.selectedMarker) {
            const lat = parseFloat(poiLat.value);
            const lng = parseFloat(poiLng.value);
            
            if (!isNaN(lat) && !isNaN(lng)) {
                this.selectedMarker.setLatLng([lat, lng]);
            }
        }
    }

    updatePOIPosition() {
        if (!this.selectedMarker) return;

        const poiLat = document.getElementById('poiLat');
        const poiLng = document.getElementById('poiLng');
        
        if (poiLat && poiLng) {
            const lat = parseFloat(poiLat.value);
            const lng = parseFloat(poiLng.value);
            
            if (isNaN(lat) || isNaN(lng)) {
                alert('Por favor ingresa coordenadas válidas');
                return;
            }

            // Actualizar posición del marcador
            this.selectedMarker.setLatLng([lat, lng]);
            
            // Mostrar mensaje de éxito
            this.showLocationMessage('success', 'Ubicación actualizada correctamente');
            
            // Log de la nueva posición para que puedas copiar las coordenadas
            console.log(`Nueva posición para ${this.selectedMarker.poiData.nameKey}:`);
            console.log(`Lat: ${lat}, Lng: ${lng}`);
            console.log(`Coordenadas para actualizar en el código: [${lat}, ${lng}]`);
        }
    }

    cancelPOIEdit() {
        if (this.selectedMarker) {
            // Restaurar posición original
            const originalPos = this.originalPositions[this.selectedMarker.poiData.id];
            if (originalPos) {
                this.selectedMarker.setLatLng(originalPos);
            }
            
            // Limpiar selección
            this.selectedMarker.getElement().classList.remove('marker-selected');
            this.selectedMarker = null;
            this.hideSelectedPOI();
        }
    }

    // ==========================================
    // Funciones de Gestión de POIs
    // ==========================================

    updatePOI() {
        if (!this.selectedMarker) return;

        const name = document.getElementById('poiName').value;
        const description = document.getElementById('poiDescription').value;
        const whatsapp = document.getElementById('poiWhatsapp').value;
        const lat = parseFloat(document.getElementById('poiLat').value);
        const lng = parseFloat(document.getElementById('poiLng').value);

        if (!name.trim()) {
            alert('El nombre es obligatorio');
            return;
        }

        if (isNaN(lat) || isNaN(lng)) {
            alert('Las coordenadas deben ser números válidos');
            return;
        }

        // Actualizar datos del POI
        this.selectedMarker.poiData.name = name;
        this.selectedMarker.poiData.description = description;
        this.selectedMarker.poiData.whatsapp = whatsapp;
        this.selectedMarker.poiData.coords = [lat, lng];
        this.selectedMarker.setLatLng([lat, lng]);

        // Remover claves de traducción para POIs editados
        delete this.selectedMarker.poiData.nameKey;
        delete this.selectedMarker.poiData.descKey;

        // Actualizar popup
        this.updateMarkerPopup(this.selectedMarker);

        // Guardar cambios
        this.savePOIsToStorage();

        // Mostrar mensaje de éxito
        this.showLocationMessage('success', 'Punto de interés actualizado y guardado');

        // Log para debugging
        console.log('POI actualizado:', this.selectedMarker.poiData);
    }

    deletePOI() {
        if (!this.selectedMarker) return;

        const poiName = this.selectedMarker.poiData.name || 'este punto';
        
        if (confirm(`¿Estás seguro de que quieres eliminar ${poiName}?`)) {
            // Remover del mapa
            this.map.removeLayer(this.selectedMarker);
            
            // Remover de la lista de marcadores
            const index = this.markers.indexOf(this.selectedMarker);
            if (index > -1) {
                this.markers.splice(index, 1);
            }
            
            // Limpiar selección
            this.selectedMarker = null;
            this.hideSelectedPOI();
            
            // Guardar cambios
            this.savePOIsToStorage();
            
            // Actualizar lista si está visible
            if (this.currentTab === 'manage') {
                this.updatePOIList();
            }
            
            // Mostrar mensaje
            this.showLocationMessage('success', 'Punto de interés eliminado y guardado');
        }
    }

    // ==========================================
    // Funciones de Agregar POIs
    // ==========================================

    startAddingPOI() {
        const name = document.getElementById('newPoiName').value.trim();
        const description = document.getElementById('newPoiDescription').value.trim();
        const whatsapp = document.getElementById('newPoiWhatsapp').value.trim();
        const type = document.getElementById('newPoiType').value;

        if (!name) {
            alert('El nombre es obligatorio');
            return;
        }

        // Verificar que no estemos ya en modo agregar
        if (this.addingMode) {
            return;
        }

        this.addingMode = true;
        const addBtn = document.getElementById('addNewPOI');
        if (addBtn) {
            addBtn.textContent = 'Haz clic en el mapa para agregar';
            addBtn.disabled = true;
        }

        // Cambiar cursor del mapa
        this.map.getContainer().style.cursor = 'crosshair';

        // Remover cualquier evento de clic previo
        this.map.off('click', this.handleMapClickForAdd);

        // Agregar evento de clic al mapa
        this.map.on('click', this.handleMapClickForAdd.bind(this));

        // Guardar datos del nuevo POI
        this.newPOIData = {
            name: name,
            description: description,
            whatsapp: whatsapp,
            type: type,
            icon: this.availableIcons[type] || this.availableIcons.other
        };

        // Mostrar mensaje informativo
        this.showLocationMessage('success', 'Modo agregar activado. Haz clic en el mapa para ubicar el punto.');
    }

    handleMapClickForAdd(e) {
        if (!this.addingMode || !this.newPOIData) {
            console.log('No está en modo agregar o no hay datos del POI');
            return;
        }

        const coords = e.latlng;
        
        console.log('Agregando POI en coordenadas:', coords);
        console.log('Datos del POI:', this.newPOIData);
        
        // Crear nuevo POI
        const newPOI = {
            id: 'poi_' + Date.now(),
            coords: [coords.lat, coords.lng],
            name: this.newPOIData.name,
            description: this.newPOIData.description || '',
            whatsapp: this.newPOIData.whatsapp || '',
            icon: this.newPOIData.icon,
            color: this.getColorForType(this.newPOIData.type)
        };

        console.log('POI creado:', newPOI);

        // Agregar marcador al mapa
        const marker = this.addMarkerToMap(newPOI);
        
        if (marker) {
            console.log('Marcador agregado exitosamente');
            
            // Guardar cambios
            this.savePOIsToStorage();

            // Limpiar formulario
            this.cancelAddingPOI();

            // Mostrar mensaje
            this.showLocationMessage('success', `Nuevo punto "${newPOI.name}" agregado y guardado correctamente`);

            // Actualizar lista
            if (this.currentTab === 'manage') {
                this.updatePOIList();
            }
        } else {
            console.error('Error al agregar marcador');
            this.showLocationMessage('error', 'Error al agregar el punto de interés');
        }
    }

    addPOIByCoordinates() {
        const name = document.getElementById('newPoiName').value.trim();
        const description = document.getElementById('newPoiDescription').value.trim();
        const whatsapp = document.getElementById('newPoiWhatsapp').value.trim();
        const lat = parseFloat(document.getElementById('newPoiLat').value);
        const lng = parseFloat(document.getElementById('newPoiLng').value);
        const type = document.getElementById('newPoiType').value;

        if (!name) {
            alert('El nombre es obligatorio');
            return;
        }

        if (isNaN(lat) || isNaN(lng)) {
            alert('Las coordenadas deben ser números válidos');
            return;
        }

        // Validar rango de coordenadas para Colombia
        if (lat < -4.5 || lat > 15 || lng < -82 || lng > -66) {
            if (!confirm('Las coordenadas están fuera del rango típico de Colombia. ¿Continuar de todos modos?')) {
                return;
            }
        }

        // Crear nuevo POI
        const newPOI = {
            id: 'poi_' + Date.now(),
            coords: [lat, lng],
            name: name,
            description: description,
            whatsapp: whatsapp,
            type: type,
            icon: this.availableIcons[type] || this.availableIcons.other,
            color: this.getColorForType(type)
        };

        console.log('Agregando POI por coordenadas:', newPOI);

        // Agregar marcador al mapa
        const marker = this.addMarkerToMap(newPOI);
        
        if (marker) {
            console.log('Marcador agregado exitosamente por coordenadas');
            
            // Guardar cambios
            this.savePOIsToStorage();

            // Limpiar formulario
            this.cancelAddingPOI();

            // Centrar el mapa en la nueva ubicación
            this.map.setView([lat, lng], Math.max(this.map.getZoom(), 16));

            // Mostrar mensaje
            this.showLocationMessage('success', `Nuevo punto "${newPOI.name}" agregado en las coordenadas especificadas`);

            // Actualizar lista
            if (this.currentTab === 'manage') {
                this.updatePOIList();
            }
        } else {
            console.error('Error al agregar marcador por coordenadas');
            this.showLocationMessage('error', 'Error al agregar el punto de interés');
        }
    }

    cancelAddingPOI() {
        this.addingMode = false;
        this.newPOIData = null;
        
        const addBtn = document.getElementById('addNewPOI');
        if (addBtn) {
            addBtn.textContent = '📍 Agregar en el mapa';
            addBtn.disabled = true;
        }
        
        // Restaurar cursor
        this.map.getContainer().style.cursor = '';
        
        // Remover evento de clic
        this.map.off('click', this.handleMapClickForAdd);

        // Limpiar formulario
        const nameInput = document.getElementById('newPoiName');
        const descInput = document.getElementById('newPoiDescription');
        const whatsappInput = document.getElementById('newPoiWhatsapp');
        const latInput = document.getElementById('newPoiLat');
        const lngInput = document.getElementById('newPoiLng');
        const typeSelect = document.getElementById('newPoiType');
        const useCoordinatesCheckbox = document.getElementById('useCoordinates');

        if (nameInput) nameInput.value = '';
        if (descInput) descInput.value = '';
        if (whatsappInput) whatsappInput.value = '';
        if (latInput) latInput.value = '';
        if (lngInput) lngInput.value = '';
        if (typeSelect) typeSelect.value = 'hotel';
        if (useCoordinatesCheckbox) {
            useCoordinatesCheckbox.checked = false;
            this.toggleCoordinatesMode(); // Resetear la interfaz
        }

        // Validar formulario después de limpiar
        this.validateAddForm();
    }

    toggleCoordinatesMode() {
        const useCoordinates = document.getElementById('useCoordinates').checked;
        const coordinatesSection = document.getElementById('coordinatesSection');
        const addBtn = document.getElementById('addNewPOI');
        const addCoordsBtn = document.getElementById('addNewPOICoords');
        
        if (useCoordinates) {
            // Mostrar campos de coordenadas
            coordinatesSection.style.display = 'block';
            addBtn.style.display = 'none';
            addCoordsBtn.style.display = 'block';
        } else {
            // Ocultar campos de coordenadas
            coordinatesSection.style.display = 'none';
            addBtn.style.display = 'block';
            addCoordsBtn.style.display = 'none';
            
            // Limpiar campos de coordenadas
            document.getElementById('newPoiLat').value = '';
            document.getElementById('newPoiLng').value = '';
        }
        
        // Validar formulario
        this.validateAddForm();
    }

    validateAddForm() {
        const name = document.getElementById('newPoiName').value.trim();
        const useCoordinates = document.getElementById('useCoordinates').checked;
        const lat = document.getElementById('newPoiLat').value.trim();
        const lng = document.getElementById('newPoiLng').value.trim();
        const addBtn = document.getElementById('addNewPOI');
        const addCoordsBtn = document.getElementById('addNewPOICoords');
        
        // Validar nombre
        const hasName = !!name;
        
        if (useCoordinates) {
            // Modo coordenadas: validar coordenadas
            const hasValidCoords = lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
            addCoordsBtn.disabled = !hasName || !hasValidCoords;
        } else {
            // Modo mapa: solo validar nombre
            addBtn.disabled = !hasName;
        }
    }

    addMarkerToMap(poiData) {
        try {
            console.log('Creando marcador con datos:', poiData);
            
            // Crear icono
            const iconHtml = `
                <div style="
                    background-color: ${poiData.color};
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                ">
                    <i class="${poiData.icon}" style="color: white; font-size: 18px;"></i>
                </div>
            `;

            const icon = L.divIcon({
                html: iconHtml,
                className: 'custom-poi-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            console.log('Icono creado:', icon);

            // Crear marcador
            const marker = L.marker(poiData.coords, { icon }).addTo(this.map);
            marker.poiData = poiData;

            console.log('Marcador creado y agregado al mapa:', marker);
            console.log('Coordenadas del marcador:', poiData.coords);
            console.log('Mapa actual:', this.map);
            console.log('¿Marcador visible en el mapa?', this.map.hasLayer(marker));

            // Agregar popup
            this.updateMarkerPopup(marker);

            // Agregar a la lista
            this.markers.push(marker);

            console.log('Marcador agregado a la lista. Total marcadores:', this.markers.length);

            return marker;
        } catch (error) {
            console.error('Error en addMarkerToMap:', error);
            return null;
        }
    }

    getColorForType(type) {
        const colors = {
            hotel: '#e74c3c',
            restaurant: '#f39c12',
            shop: '#9b59b6',
            hospital: '#e67e22',
            school: '#3498db',
            church: '#9b59b6',
            park: '#27ae60',
            gas_station: '#95a5a6',
            bank: '#2c3e50',
            other: '#34495e'
        };
        return colors[type] || colors.other;
    }

    // ==========================================
    // Configuración de Capas de Mapas
    // ==========================================

    setupMapLayers() {
        // OpenStreetMap (por defecto)
        this.mapLayers.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        });

        // Satélite (Esri)
        this.mapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
            maxZoom: 19
        });

        // Relieve (Esri)
        this.mapLayers.terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
            maxZoom: 19
        });

        // Mapa Oscuro (CartoDB)
        this.mapLayers.dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        });
    }

    changeMapLayer(layerType) {
        // Remover capa actual
        if (this.currentLayer) {
            this.map.removeLayer(this.currentLayer);
        }

        // Agregar nueva capa
        this.currentLayer = this.mapLayers[layerType];
        if (this.currentLayer) {
            this.currentLayer.addTo(this.map);
        }

        // Actualizar UI
        this.updateMapTypeUI(layerType);
    }

    updateMapTypeUI(activeType) {
        const options = document.querySelectorAll('.map-type-option');
        options.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-type') === activeType) {
                option.classList.add('active');
            }
        });
    }

    // ==========================================
    // Escala Sencilla
    // ==========================================

    addSimpleScale() {
        // Crear una escala simple y fija
        const scaleContainer = document.createElement('div');
        scaleContainer.id = 'simple-scale';
        scaleContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #333;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        
        scaleContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 60px; height: 3px; background: #333; border-radius: 2px;"></div>
                <span>≈ 100m</span>
            </div>
            <div style="font-size: 10px; color: #666; margin-top: 2px;">
                Distancia aproximada
            </div>
        `;
        
        // Agregar al contenedor del mapa
        const mapContainer = document.getElementById('map');
        mapContainer.appendChild(scaleContainer);
    }

    // ==========================================
    // Funciones de Diagnóstico
    // ==========================================
    
    // Función de diagnóstico para llamar desde la consola
    diagnosticarGuardado() {
        console.log('🔍 === DIAGNÓSTICO DE GUARDADO ===');
        console.log('🔑 Storage key:', this.storageKey);
        console.log('📊 Marcadores disponibles:', this.markers ? this.markers.length : 'UNDEFINED');
        console.log('🗺️ Mapa disponible:', !!this.map);
        
        if (this.markers) {
            console.log('📍 Detalles de marcadores:');
            this.markers.forEach((marker, index) => {
                console.log(`  Marcador ${index + 1}:`, {
                    id: marker.poiData?.id,
                    name: marker.poiData?.name,
                    coords: marker.getLatLng(),
                    hasPoiData: !!marker.poiData
                });
            });
        }
        
        // Probar guardado manual
        console.log('🧪 Probando guardado manual...');
        const resultado = this.savePOIsToStorage();
        console.log('✅ Resultado del guardado:', resultado);
        
        // Verificar en localStorage
        const datosGuardados = localStorage.getItem(this.storageKey);
        console.log('📦 Datos en localStorage:', datosGuardados);
        
        return {
            storageKey: this.storageKey,
            markersCount: this.markers ? this.markers.length : 0,
            mapAvailable: !!this.map,
            saveResult: resultado,
            localStorageData: datosGuardados
        };
    }

    // ==========================================
    // Funciones de Persistencia
    // ==========================================

    savePOIsToStorage() {
        try {
            console.log('💾 Iniciando guardado de POIs...');
            console.log('🔑 Storage key:', this.storageKey);
            console.log('📊 Total marcadores a guardar:', this.markers ? this.markers.length : 'UNDEFINED');
            console.log('🗺️ Mapa disponible:', !!this.map);
            
            // Verificar que this.markers esté definido
            if (!this.markers) {
                console.error('❌ this.markers no está definido');
                return false;
            }
            
            // Verificar que this.storageKey esté definido
            if (!this.storageKey) {
                console.error('❌ this.storageKey no está definido');
                return false;
            }
            
            if (this.markers.length === 0) {
                console.log('⚠️ No hay marcadores para guardar');
                return false;
            }
            
            // Guardar TODOS los marcadores (originales y personalizados) con sus posiciones actuales
            const allPOIs = this.markers.map((marker, index) => {
                try {
                    const coords = marker.getLatLng();
                    const poiData = {
                        id: marker.poiData.id || 'poi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        coords: [coords.lat, coords.lng], // Posición actual del marcador
                        name: marker.poiData.name || marker.poiData.nameKey || 'Punto de interés', // Usar nameKey si no hay name
                        description: marker.poiData.description || '',
                        whatsapp: marker.poiData.whatsapp || '',
                        icon: marker.poiData.icon || 'fas fa-map-marker-alt',
                        color: marker.poiData.color || '#3498db',
                        type: marker.poiData.type || 'other',
                        // Preservar información original
                        nameKey: marker.poiData.nameKey,
                        descKey: marker.poiData.descKey,
                        // Marcar si fue editado
                        edited: !marker.poiData.nameKey || marker.poiData.name
                    };
                    
                    console.log(`📍 POI ${index + 1} preparado para guardar:`, poiData);
                    return poiData;
                } catch (error) {
                    console.error(`❌ Error procesando marcador ${index + 1}:`, error);
                    return null;
                }
            }).filter(poi => poi !== null); // Filtrar nulos

            console.log('✅ POIs procesados:', allPOIs);
            console.log('📊 Cantidad final a guardar:', allPOIs.length);

            const jsonData = JSON.stringify(allPOIs);
            localStorage.setItem(this.storageKey, jsonData);
            console.log('💾 POIs guardados en localStorage con clave:', this.storageKey);
            
            // Verificar que realmente se guardó
            const saved = localStorage.getItem(this.storageKey);
            if (saved === jsonData) {
                console.log('✅ Verificación exitosa: datos guardados correctamente');
                return true;
            } else {
                console.error('❌ Verificación fallida: datos no coinciden');
                return false;
            }
        } catch (error) {
            console.error('❌ Error al guardar POIs:', error);
            console.error('🔧 Stack trace:', error.stack);
            return false;
        }
    }

    loadSavedPOIs() {
        try {
            console.log('🔄 Iniciando carga de POIs guardados...');
            console.log('🔑 Clave de storage:', this.storageKey);
            
            const savedPOIs = localStorage.getItem(this.storageKey);
            console.log('📦 Datos raw en localStorage:', savedPOIs);
            
            if (savedPOIs) {
                const pois = JSON.parse(savedPOIs);
                console.log('✅ POIs parseados desde localStorage:', pois);
                console.log('📊 Cantidad de POIs a cargar:', pois.length);
                
                if (pois.length === 0) {
                    console.log('⚠️ Array vacío, cargando POIs originales');
                    this.addPointsOfInterest();
                    return [];
                }
                
                pois.forEach((poiData, index) => {
                    console.log(`📍 Cargando POI ${index + 1}:`, poiData);
                    
                    // Verificar que el POI tiene los datos necesarios
                    if (!poiData.name && !poiData.nameKey) {
                        console.error(`❌ POI ${index + 1} no tiene nombre ni nameKey, saltando...`);
                        return;
                    }
                    
                    // Si no tiene name pero tiene nameKey, usar un nombre por defecto
                    if (!poiData.name && poiData.nameKey) {
                        poiData.name = poiData.nameKey; // Usar nameKey como nombre temporal
                        console.log(`🔧 POI ${index + 1} usando nameKey como nombre: ${poiData.nameKey}`);
                    }
                    
                    if (!poiData.coords || !Array.isArray(poiData.coords) || poiData.coords.length !== 2) {
                        console.error(`❌ POI ${index + 1} tiene coordenadas inválidas:`, poiData.coords);
                        return;
                    }
                    
                    // Asegurar que el POI tiene un ID válido
                    if (!poiData.id) {
                        poiData.id = 'poi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        console.log(`🔧 POI ${index + 1} sin ID, asignado:`, poiData.id);
                    }
                    
                    // Asegurar que el POI tiene un tipo válido
                    if (!poiData.type) {
                        poiData.type = 'other';
                        console.log(`🔧 POI ${index + 1} sin tipo, asignado: other`);
                    }
                    
                    // Asegurar que el POI tiene un icono válido
                    if (!poiData.icon) {
                        poiData.icon = 'fas fa-map-marker-alt';
                        console.log(`🔧 POI ${index + 1} sin icono, asignado: fas fa-map-marker-alt`);
                    }
                    
                    // Asegurar que el POI tiene un color válido
                    if (!poiData.color) {
                        poiData.color = '#3498db';
                        console.log(`🔧 POI ${index + 1} sin color, asignado: #3498db`);
                    }
                    
                    const marker = this.addMarkerToMap(poiData);
                    if (marker) {
                        console.log(`✅ POI ${index + 1} cargado exitosamente`);
                    } else {
                        console.error(`❌ Error cargando POI ${index + 1}`);
                    }
                });
                
                console.log('🎯 Total marcadores después de cargar:', this.markers.length);
                
                // Verificar que se cargaron correctamente
                if (this.markers.length === 0) {
                    console.log('⚠️ No se cargaron marcadores, cargando POIs originales');
                    this.addPointsOfInterest();
                }
                
                return pois;
            } else {
                console.log('📭 No hay POIs guardados en localStorage, cargando originales');
                // Si no hay POIs guardados, cargar los originales
                this.addPointsOfInterest();
            }
        } catch (error) {
            console.error('❌ Error al cargar POIs guardados:', error);
            console.error('🔧 Stack trace:', error.stack);
            // En caso de error, cargar los originales
            this.addPointsOfInterest();
        }
        return [];
    }

    clearAllSavedPOIs() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Todos los POIs guardados han sido eliminados');
            return true;
        } catch (error) {
            console.error('Error al limpiar POIs guardados:', error);
            return false;
        }
    }


    // ==========================================
    // Funciones de Galería de Iconos
    // ==========================================

    showIconGallery() {
        const gallery = document.getElementById('iconGallery');
        gallery.style.display = 'flex';
    }

    hideIconGallery() {
        const gallery = document.getElementById('iconGallery');
        gallery.style.display = 'none';
    }

    populateIconGallery() {
        const iconGrid = document.querySelector('.icon-grid');
        if (!iconGrid) return;

        iconGrid.innerHTML = '';

        Object.entries(this.availableIcons).forEach(([key, iconClass]) => {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'icon-option';
            iconDiv.innerHTML = `<i class="${iconClass}"></i>`;
            iconDiv.addEventListener('click', () => {
                this.selectIcon(key, iconClass);
            });
            iconGrid.appendChild(iconDiv);
        });
    }

    selectIcon(key, iconClass) {
        if (!this.selectedMarker) return;

        // Actualizar icono del marcador
        this.selectedMarker.poiData.icon = iconClass;
        
        // Actualizar icono visual
        const iconHtml = `
            <div style="
                background-color: ${this.selectedMarker.poiData.color};
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            ">
                <i class="${iconClass}" style="color: white; font-size: 18px;"></i>
            </div>
        `;

        const newIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-poi-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        this.selectedMarker.setIcon(newIcon);

        // Actualizar preview en el panel
        const iconPreview = document.getElementById('selectedIcon');
        if (iconPreview) {
            iconPreview.innerHTML = `<i class="${iconClass}"></i>`;
        }

        // Cerrar galería
        this.hideIconGallery();

        // Mostrar mensaje
        this.showLocationMessage('success', 'Icono actualizado');
    }

    // ==========================================
    // Funciones de Lista de POIs
    // ==========================================

    updatePOIList() {
        const poiList = document.getElementById('poiList');
        if (!poiList) return;

        poiList.innerHTML = '';

        if (this.markers.length === 0) {
            poiList.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No hay puntos de interés registrados</div>';
            return;
        }

        this.markers.forEach((marker, index) => {
            const poiItem = document.createElement('div');
            poiItem.className = 'poi-list-item';
            poiItem.setAttribute('data-id', index);
            
            // Estructura responsiva mejorada
            poiItem.innerHTML = `
                <div class="poi-name">
                    <i class="${marker.poiData.icon}" style="margin-right: 8px; color: #3498db;"></i>
                    ${marker.poiData.name}
                </div>
                <div class="poi-details">${marker.poiData.description || 'Sin descripción'}</div>
                ${marker.poiData.whatsapp ? `<div class="poi-whatsapp">📱 ${marker.poiData.whatsapp}</div>` : ''}
            `;
            
            // Event listener para seleccionar POI
            poiItem.addEventListener('click', () => {
                this.selectMarkerFromList(index);
            });
            
            poiList.appendChild(poiItem);
        });
    }

    selectMarkerFromList(index) {
        if (this.markers[index]) {
            // Limpiar selección anterior
            document.querySelectorAll('.poi-list-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Marcar item como seleccionado
            const selectedItem = document.querySelector(`[data-id="${index}"]`);
            if (selectedItem) {
                selectedItem.classList.add('selected');
            }
            
            // Cambiar a tab de edición
            document.querySelector('[data-tab="edit"]').click();
            
            // Seleccionar marcador
            this.selectMarker(this.markers[index]);
        }
    }

    deleteMarkerFromList(index) {
        if (this.markers[index]) {
            const marker = this.markers[index];
            const poiName = marker.poiData.name || 'este punto';
            
            if (confirm(`¿Estás seguro de que quieres eliminar ${poiName}?`)) {
                // Remover del mapa
                this.map.removeLayer(marker);
                
                // Remover de la lista
                this.markers.splice(index, 1);
                
                // Actualizar lista
                this.updatePOIList();
                
                // Mostrar mensaje
                this.showLocationMessage('success', 'Punto de interés eliminado');
            }
        }
    }
}

// Instancia global del mapa
let puerresMap;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    puerresMap = new PuerresMap();
    puerresMap.init();
});

