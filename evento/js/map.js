// ==========================================
// Configuración del Mapa de Puerres
// ==========================================

// Coordenadas de Puerres, Nariño, Colombia
const PUERRES_CENTER = [0.883159, -77.504078]; // Lat, Lng
const DEFAULT_ZOOM = 15;

// ==========================================
// Puntos de Interés Originales
// ==========================================
const pointsOfInterest = [
    {
        id: 'townhall',
        coords: [0.883200, -77.504000],
        name: 'Alcaldía Municipal',
        description: 'Casa de gobierno de Puerres',
        icon: 'fas fa-building',
        color: '#e74c3c',
        whatsapp: '3001234567',
        type: 'government'
    },
    {
        id: 'church',
        coords: [0.883100, -77.504100],
        name: 'Iglesia Principal',
        description: 'Templo católico principal',
        icon: 'fas fa-church',
        color: '#9b59b6',
        whatsapp: '3009876543',
        type: 'church'
    },
    {
        id: 'park',
        coords: [0.883300, -77.504150],
        name: 'Parque Central',
        description: 'Parque principal del municipio',
        icon: 'fas fa-tree',
        color: '#27ae60',
        whatsapp: '3005555555',
        type: 'park'
    },
    {
        id: 'health',
        coords: [0.883000, -77.503950],
        name: 'Centro de Salud',
        description: 'Servicios médicos básicos',
        icon: 'fas fa-hospital',
        color: '#e67e22',
        whatsapp: '3001111111',
        type: 'hospital'
    },
    {
        id: 'school',
        coords: [0.883250, -77.504200],
        name: 'Escuela Municipal',
        description: 'Institución educativa',
        icon: 'fas fa-graduation-cap',
        color: '#3498db',
        whatsapp: '3002222222',
        type: 'school'
    },
    {
        id: 'police',
        coords: [0.883350, -77.504050],
        name: 'Estación de Policía',
        description: 'Seguridad ciudadana',
        icon: 'fas fa-shield-alt',
        color: '#2c3e50',
        whatsapp: '3003333333',
        type: 'police'
    }
];

// ==========================================
// Clase Principal del Mapa
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
        
        // Iconos disponibles
        this.availableIcons = {
            // Alojamiento
            hotel: 'fas fa-bed',
            hostel: 'fas fa-home',
            camping: 'fas fa-campground',
            
            // Restaurantes
            restaurant: 'fas fa-utensils',
            cafe: 'fas fa-coffee',
            bar: 'fas fa-wine-glass-alt',
            fast_food: 'fas fa-hamburger',
            
            // Servicios
            bank: 'fas fa-university',
            gas_station: 'fas fa-gas-pump',
            pharmacy: 'fas fa-pills',
            hospital: 'fas fa-hospital',
            police: 'fas fa-shield-alt',
            
            // Comercio
            shop: 'fas fa-store',
            supermarket: 'fas fa-shopping-cart',
            market: 'fas fa-store-alt',
            clothing: 'fas fa-tshirt',
            electronics: 'fas fa-laptop',
            bookstore: 'fas fa-book',
            
            // Servicios de Salud
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
            parking: 'fas fa-parking',
            bus_station: 'fas fa-bus',
            airport: 'fas fa-plane',
            taxi: 'fas fa-taxi',
            
            // Servicios Financieros
            atm: 'fas fa-credit-card',
            money_exchange: 'fas fa-exchange-alt',
            
            // Entretenimiento
            cinema: 'fas fa-film',
            theater: 'fas fa-theater-masks',
            music: 'fas fa-music',
            
            // Gobierno
            government: 'fas fa-landmark',
            post_office: 'fas fa-mail-bulk',
            court: 'fas fa-gavel',
            
            // Otros
            other: 'fas fa-map-marker-alt',
            border: 'fas fa-flag'
        };
    }

    // ==========================================
    // Inicialización
    // ==========================================
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
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }
        }, 1000);
    }

    // ==========================================
    // Configuración de Capas de Mapa
    // ==========================================
    setupMapLayers() {
        this.mapLayers = {
            osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                name: 'Estándar'
            }),
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri',
                name: 'Satélite'
            }),
            terrain: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri',
                name: 'Terreno'
            }),
            dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CartoDB',
                name: 'Oscuro'
            })
        };
    }

    // ==========================================
    // Escala Simple
    // ==========================================
    addSimpleScale() {
        const scaleContainer = document.createElement('div');
        scaleContainer.className = 'simple-scale';
        scaleContainer.innerHTML = '<span>≈ 100m</span>';
        
        // Agregar al contenedor del mapa
        const mapContainer = document.getElementById('map');
        mapContainer.appendChild(scaleContainer);
    }

    // ==========================================
    // Configuración de Controles
    // ==========================================
    setupControls() {
        // Botón de ubicación
        this.setupLocationButton();
        
        // Selector de tipo de mapa
        this.setupMapTypeSelector();
        
        // Panel de edición
        this.setupEditPanel();
        
        // Modales
        this.setupModals();
    }

    // ==========================================
    // Botón de Ubicación
    // ==========================================
    setupLocationButton() {
        // Crear botón de ubicación personalizado
        const locationControl = L.Control.extend({
            onAdd: (map) => {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.style.backgroundColor = 'white';
                container.style.border = '2px solid rgba(0,0,0,0.2)';
                container.style.borderRadius = '4px';
                container.style.cursor = 'pointer';
                container.style.padding = '8px';
                container.style.marginTop = '10px';
                
                container.innerHTML = '<i class="fas fa-crosshairs" style="color: #333; font-size: 16px;"></i>';
                
                container.onclick = () => {
                    this.locateUser();
                };
                
                return container;
            }
        });
        
        new locationControl({ position: 'topright' }).addTo(this.map);
    }

    // ==========================================
    // Geolocalización
    // ==========================================
    async locateUser() {
        this.showLocationLoading();
        
        try {
            // Intentar geolocalización de alta precisión
            const position = await this.getCurrentPosition({ 
                enableHighAccuracy: true, 
                timeout: 10000, 
                maximumAge: 300000 
            });
            
            this.handleLocationSuccess(position, false);
            
        } catch (error) {
            console.log('Geolocalización de alta precisión falló, intentando baja precisión...');
            
            try {
                // Intentar geolocalización de baja precisión
                const position = await this.getCurrentPosition({ 
                    enableHighAccuracy: false, 
                    timeout: 15000, 
                    maximumAge: 600000 
                });
                
                this.handleLocationSuccess(position, true);
                
            } catch (error2) {
                console.log('Geolocalización GPS falló, usando ubicación por IP...');
                
                try {
                    // Fallback a ubicación por IP
                    const ipLocation = await this.getLocationByIP();
                    this.handleLocationSuccess(ipLocation, true);
                    
                } catch (error3) {
                    this.handleLocationError(error3);
                }
            }
        }
    }

    getCurrentPosition(options) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalización no soportada'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    async getLocationByIP() {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.latitude && data.longitude) {
            return {
                coords: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    accuracy: 5000 // Aproximado por IP
                }
            };
        } else {
            throw new Error('No se pudo obtener ubicación por IP');
        }
    }

    handleLocationSuccess(position, isApproximate) {
        this.hideLocationLoading();
        
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        // Remover marcador de usuario anterior si existe
        if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
        }
        
        // Crear marcador de usuario
        const userIcon = L.divIcon({
            html: `
                <div style="
                    background-color: ${isApproximate ? '#f39c12' : '#3498db'};
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid white;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                ">
                    <i class="fas fa-user" style="color: white; font-size: 18px;"></i>
                </div>
            `,
            className: 'custom-user-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        this.userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(this.map);
        
        // Crear popup
        const popupContent = `
            <div style="text-align: center;">
                <h4 style="margin: 0 0 10px 0; color: ${isApproximate ? '#f39c12' : '#3498db'};">
                    ${isApproximate ? '📍 Ubicación Aproximada' : '📍 Tu Ubicación'}
                </h4>
                <p style="margin: 5px 0; font-size: 12px; color: #666;">
                    ${isApproximate ? 'Ubicación estimada por IP' : 'Ubicación GPS precisa'}
                </p>
                <p style="margin: 5px 0; font-size: 11px; color: #888;">
                    Precisión: ${Math.round(accuracy)}m
                </p>
            </div>
        `;
        
        this.userMarker.bindPopup(popupContent).openPopup();
        
        // Centrar mapa
        this.map.setView([lat, lng], 16);
        
        // Agregar círculo de precisión si es aproximado
        if (isApproximate && accuracy > 1000) {
            const accuracyCircle = L.circle([lat, lng], {
                radius: accuracy,
                color: '#f39c12',
                fillColor: '#f39c12',
                fillOpacity: 0.1,
                weight: 2
            }).addTo(this.map);
            
            setTimeout(() => {
                this.map.removeLayer(accuracyCircle);
            }, 10000);
        }
        
        // Mostrar mensaje
        this.showLocationMessage('success', isApproximate ? 
            'Ubicación aproximada encontrada' : 
            'Ubicación encontrada correctamente'
        );
    }

    handleLocationError(error) {
        this.hideLocationLoading();
        
        let errorMessage = 'Error desconocido';
        let suggestion = 'Intenta más tarde';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'Permiso denegado';
                suggestion = 'Habilita la ubicación en tu navegador';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'Ubicación no disponible';
                suggestion = 'Verifica tu conexión a internet';
                break;
            case error.TIMEOUT:
                errorMessage = 'Tiempo de espera agotado';
                suggestion = 'Intenta nuevamente';
                break;
        }
        
        this.showLocationError(errorMessage, suggestion);
    }

    showLocationLoading() {
        const status = document.getElementById('onlineStatus');
        if (status) {
            status.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Buscando ubicación...</span>';
            status.className = 'online-status';
        }
    }

    hideLocationLoading() {
        const status = document.getElementById('onlineStatus');
        if (status) {
            status.innerHTML = '<i class="fas fa-wifi"></i><span>En línea</span>';
            status.className = 'online-status';
        }
    }

    showLocationMessage(type, message) {
        const status = document.getElementById('onlineStatus');
        if (status) {
            status.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i><span>${message}</span>`;
            status.className = `online-status ${type}`;
            
            setTimeout(() => {
                status.innerHTML = '<i class="fas fa-wifi"></i><span>En línea</span>';
                status.className = 'online-status';
            }, 3000);
        }
    }

    showLocationError(message, suggestion) {
        const status = document.getElementById('onlineStatus');
        if (status) {
            status.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>${message}</span>`;
            status.className = 'online-status error';
        }
        
        // Mostrar modal de error con sugerencias
        setTimeout(() => {
            alert(`Error de ubicación: ${message}\n\nSugerencia: ${suggestion}`);
        }, 1000);
    }

    // ==========================================
    // Selector de Tipo de Mapa
    // ==========================================
    setupMapTypeSelector() {
        const mapTypeBtn = document.getElementById('mapTypeBtn');
        const mapTypeMenu = document.getElementById('mapTypeMenu');
        
        if (!mapTypeBtn || !mapTypeMenu) return;
        
        // Mostrar/ocultar menú
        mapTypeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mapTypeMenu.classList.toggle('active');
        });
        
        // Ocultar menú al hacer clic fuera
        document.addEventListener('click', () => {
            mapTypeMenu.classList.remove('active');
        });
        
        // Manejar selección de tipo de mapa
        mapTypeMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            const option = e.target.closest('.map-type-option');
            if (option) {
                const mapType = option.dataset.type;
                this.changeMapLayer(mapType);
                
                // Actualizar UI
                mapTypeMenu.querySelectorAll('.map-type-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
                
                mapTypeMenu.classList.remove('active');
            }
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
    }

    // ==========================================
    // Panel de Edición
    // ==========================================
    setupEditPanel() {
        const editModeBtn = document.getElementById('editModeBtn');
        const editPanel = document.getElementById('editPanel');
        const closeEditPanel = document.getElementById('closeEditPanel');
        const minimizePanel = document.getElementById('minimizePanel');
        
        if (!editModeBtn || !editPanel) return;
        
        // Botón de edición
        editModeBtn.addEventListener('click', () => {
            this.showAuthModal();
        });
        
        // Botón de cerrar
        closeEditPanel.addEventListener('click', () => {
            this.closeEditMode();
        });
        
        // Botón de minimizar
        minimizePanel.addEventListener('click', () => {
            this.togglePanelMinimize();
        });
        
        // Configurar tabs
        this.setupTabs();
        
        // Configurar formularios
        this.setupEditForm();
        this.setupAddForm();
        
        // Configurar galería de iconos
        this.setupIconGallery();
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Actualizar botones
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Actualizar paneles
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === `${tabName}Tab`) {
                        panel.classList.add('active');
                    }
                });
                
                this.currentTab = tabName;
                
                // Actualizar lista si es necesario
                if (tabName === 'manage') {
                    this.updatePOIList();
                }
            });
        });
    }

    setupEditForm() {
        const updateBtn = document.getElementById('updatePOI');
        const deleteBtn = document.getElementById('deletePOI');
        const cancelBtn = document.getElementById('cancelEdit');
        
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                this.updatePOI();
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deletePOI();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelPOIEdit();
            });
        }
    }

    setupAddForm() {
        const startBtn = document.getElementById('startAddingPOI');
        const cancelBtn = document.getElementById('cancelAddingPOI');
        const useCoordinates = document.getElementById('useCoordinates');
        const addCoordsBtn = document.getElementById('addNewPOICoords');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startAddingPOI();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelAddingPOI();
            });
        }
        
        if (useCoordinates) {
            useCoordinates.addEventListener('change', () => {
                this.toggleCoordinatesMode();
            });
        }
        
        if (addCoordsBtn) {
            addCoordsBtn.addEventListener('click', () => {
                this.addPOIByCoordinates();
            });
        }
        
        // Validación en tiempo real
        const nameInput = document.getElementById('newPoiName');
        const latInput = document.getElementById('newPoiLat');
        const lngInput = document.getElementById('newPoiLng');
        
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                this.validateAddForm();
            });
        }
        
        if (latInput && lngInput) {
            latInput.addEventListener('input', () => this.validateAddForm());
            lngInput.addEventListener('input', () => this.validateAddForm());
        }
    }

    setupIconGallery() {
        const selectIconBtn = document.getElementById('selectIconBtn');
        const iconGallery = document.getElementById('iconGallery');
        const closeIconGallery = document.getElementById('closeIconGallery');
        
        if (selectIconBtn) {
            selectIconBtn.addEventListener('click', () => {
                this.showIconGallery();
            });
        }
        
        if (closeIconGallery) {
            closeIconGallery.addEventListener('click', () => {
                this.hideIconGallery();
            });
        }
        
        // Cerrar al hacer clic fuera
        if (iconGallery) {
            iconGallery.addEventListener('click', (e) => {
                if (e.target === iconGallery) {
                    this.hideIconGallery();
                }
            });
        }
    }

    // ==========================================
    // Modales
    // ==========================================
    setupModals() {
        this.setupAuthModal();
    }

    setupAuthModal() {
        const authModal = document.getElementById('authModal');
        const authForm = document.getElementById('authForm');
        const closeAuthModal = document.getElementById('closeAuthModal');
        
        if (closeAuthModal) {
            closeAuthModal.addEventListener('click', () => {
                this.hideAuthModal();
            });
        }
        
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.authenticateUser();
            });
        }
        
        // Cerrar al hacer clic fuera
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    this.hideAuthModal();
                }
            });
        }
    }

    // ==========================================
    // Autenticación
    // ==========================================
    showAuthModal() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.add('active');
            document.getElementById('username').focus();
        }
    }

    hideAuthModal() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.remove('active');
        }
    }

    authenticateUser() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('authError');
        
        if (username === 'ciase' && password === 'ciase123') {
            this.hideAuthModal();
            this.enableEditMode();
            this.showLocationMessage('success', 'Modo de edición activado');
        } else {
            if (errorDiv) {
                errorDiv.style.display = 'block';
            }
            setTimeout(() => {
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }
            }, 3000);
        }
    }

    enableEditMode() {
        this.editMode = true;
        const editModeBtn = document.getElementById('editModeBtn');
        const editPanel = document.getElementById('editPanel');
        
        if (editModeBtn) {
            editModeBtn.classList.add('active');
        }
        
        if (editPanel) {
            editPanel.classList.add('active');
        }
        
        // Hacer marcadores arrastrables
        this.markers.forEach(marker => {
            if (marker.dragging) {
                marker.dragging.enable();
            }
            marker.getElement().classList.add('marker-editable');
        });
        
        // Configurar eventos de clic en marcadores
        this.markers.forEach(marker => {
            marker.off('click');
            marker.on('click', () => {
                this.selectMarker(marker);
            });
        });
    }

    closeEditMode() {
        this.editMode = false;
        const editModeBtn = document.getElementById('editModeBtn');
        const editPanel = document.getElementById('editPanel');
        
        if (editModeBtn) {
            editModeBtn.classList.remove('active');
        }
        
        if (editPanel) {
            editPanel.classList.remove('active');
            editPanel.classList.remove('minimized');
        }
        
        // Restaurar comportamiento normal de marcadores
        this.markers.forEach(marker => {
            if (marker.dragging) {
                marker.dragging.disable();
            }
            marker.getElement().classList.remove('marker-editable', 'marker-selected');
            
            // Restaurar popup
            marker.off('click');
            marker.on('click', () => {
                marker.openPopup();
            });
        });
        
        this.selectedMarker = null;
        this.hideSelectedPOI();
    }

    togglePanelMinimize() {
        const editPanel = document.getElementById('editPanel');
        const minimizeBtn = document.getElementById('minimizePanel');
        
        if (editPanel && minimizeBtn) {
            editPanel.classList.toggle('minimized');
            
            const icon = minimizeBtn.querySelector('i');
            if (editPanel.classList.contains('minimized')) {
                icon.className = 'fas fa-plus';
            } else {
                icon.className = 'fas fa-minus';
            }
        }
    }

    // ==========================================
    // Gestión de POIs
    // ==========================================
    selectMarker(marker) {
        // Remover selección anterior
        if (this.selectedMarker) {
            this.selectedMarker.getElement().classList.remove('marker-selected');
        }
        
        // Seleccionar nuevo marcador
        this.selectedMarker = marker;
        marker.getElement().classList.add('marker-selected');
        
        // Mostrar información en el panel
        this.showSelectedPOI(marker);
    }

    showSelectedPOI(marker) {
        const poiData = marker.poiData;
        
        // Llenar formulario de edición
        document.getElementById('poiName').value = poiData.name || '';
        document.getElementById('poiDescription').value = poiData.description || '';
        document.getElementById('poiWhatsapp').value = poiData.whatsapp || '';
        
        const coords = marker.getLatLng();
        document.getElementById('poiLat').value = coords.lat.toFixed(6);
        document.getElementById('poiLng').value = coords.lng.toFixed(6);
        
        // Actualizar preview del icono
        const iconPreview = document.getElementById('iconPreview');
        if (iconPreview) {
            iconPreview.innerHTML = `<i class="${poiData.icon}"></i>`;
            iconPreview.style.backgroundColor = poiData.color;
        }
        
        // Cambiar a tab de edición
        const editTab = document.querySelector('[data-tab="edit"]');
        if (editTab) {
            editTab.click();
        }
    }

    hideSelectedPOI() {
        document.getElementById('poiName').value = '';
        document.getElementById('poiDescription').value = '';
        document.getElementById('poiWhatsapp').value = '';
        document.getElementById('poiLat').value = '';
        document.getElementById('poiLng').value = '';
        
        const iconPreview = document.getElementById('iconPreview');
        if (iconPreview) {
            iconPreview.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
            iconPreview.style.backgroundColor = '#667eea';
        }
    }

    async updatePOI() {
        if (!this.selectedMarker) return;
        
        const name = document.getElementById('poiName').value.trim();
        const description = document.getElementById('poiDescription').value.trim();
        const whatsapp = document.getElementById('poiWhatsapp').value.trim();
        
        if (!name) {
            alert('El nombre es obligatorio');
            return;
        }
        
        // Actualizar datos del marcador
        this.selectedMarker.poiData.name = name;
        this.selectedMarker.poiData.description = description;
        this.selectedMarker.poiData.whatsapp = whatsapp;
        
        // Actualizar popup
        this.updateMarkerPopup(this.selectedMarker);
        
        // Guardar cambios en el servidor
        try {
            const response = await fetch('save-pois.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.selectedMarker.poiData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showLocationMessage('success', 'Punto de interés actualizado y guardado en el servidor');
                console.log('✅ POI actualizado en el servidor:', result.data);
            } else {
                this.showLocationMessage('error', 'Error al actualizar: ' + result.message);
                console.error('❌ Error actualizando POI:', result.message);
            }
        } catch (error) {
            this.showLocationMessage('error', 'Error de conexión al actualizar');
            console.error('❌ Error de red actualizando POI:', error);
        }
        
        // Actualizar lista si está visible
        if (this.currentTab === 'manage') {
            this.updatePOIList();
        }
    }

    async deletePOI() {
        if (!this.selectedMarker) return;
        
        if (confirm('¿Estás seguro de que quieres eliminar este punto de interés?')) {
            const poiId = this.selectedMarker.poiData.id;
            
            try {
                // Eliminar del servidor
                const response = await fetch('save-pois.php', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: poiId })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Remover del mapa
                    this.map.removeLayer(this.selectedMarker);
                    
                    // Remover de la lista
                    const index = this.markers.indexOf(this.selectedMarker);
                    if (index > -1) {
                        this.markers.splice(index, 1);
                    }
                    
                    // Limpiar selección
                    this.selectedMarker = null;
                    this.hideSelectedPOI();
                    
                    this.showLocationMessage('success', 'Punto de interés eliminado del servidor');
                    console.log('✅ POI eliminado del servidor:', result.data);
                    
                    // Actualizar lista si está visible
                    if (this.currentTab === 'manage') {
                        this.updatePOIList();
                    }
                } else {
                    this.showLocationMessage('error', 'Error al eliminar: ' + result.message);
                    console.error('❌ Error eliminando POI:', result.message);
                }
            } catch (error) {
                this.showLocationMessage('error', 'Error de conexión al eliminar');
                console.error('❌ Error de red eliminando POI:', error);
            }
        }
    }

    cancelPOIEdit() {
        this.selectedMarker = null;
        this.hideSelectedPOI();
        
        // Remover selección visual
        this.markers.forEach(marker => {
            marker.getElement().classList.remove('marker-selected');
        });
    }

    // ==========================================
    // Agregar POIs
    // ==========================================
    startAddingPOI() {
        const name = document.getElementById('newPoiName').value.trim();
        
        if (!name) {
            alert('El nombre es obligatorio');
            return;
        }
        
        this.addingMode = true;
        
        // Cambiar cursor del mapa
        this.map.getContainer().style.cursor = 'crosshair';
        
        // Configurar evento de clic en el mapa
        this.map.on('click', (e) => {
            this.handleMapClickForAdd(e);
        });
        
        this.showLocationMessage('info', 'Haz clic en el mapa para agregar el punto');
    }

    async handleMapClickForAdd(e) {
        if (!this.addingMode) return;
        
        const name = document.getElementById('newPoiName').value.trim();
        const description = document.getElementById('newPoiDescription').value.trim();
        const whatsapp = document.getElementById('newPoiWhatsapp').value.trim();
        const type = document.getElementById('newPoiType').value;
        
        // Crear nuevo POI
        const newPOI = {
            coords: [e.latlng.lat, e.latlng.lng],
            name: name,
            description: description,
            whatsapp: whatsapp,
            icon: this.availableIcons[type] || this.availableIcons.other,
            color: this.getColorForType(type),
            type: type
        };
        
        console.log('Agregando nuevo POI:', newPOI);
        
        try {
            // Guardar en el servidor
            const response = await fetch('save-pois.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPOI)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Agregar marcador al mapa con el ID del servidor
                const poiWithId = result.data;
                const marker = this.addMarkerToMap(poiWithId);
                
                if (marker) {
                    console.log('✅ Marcador agregado exitosamente al mapa y servidor');
                    this.showLocationMessage('success', 'Punto de interés agregado y guardado en el servidor');
                    
                    // Limpiar formulario
                    this.cancelAddingPOI();
                } else {
                    console.error('❌ Error al agregar marcador al mapa');
                    this.showLocationMessage('error', 'Error al mostrar el marcador');
                }
            } else {
                console.error('❌ Error guardando POI en servidor:', result.message);
                this.showLocationMessage('error', 'Error al guardar: ' + result.message);
            }
        } catch (error) {
            console.error('❌ Error de red:', error);
            this.showLocationMessage('error', 'Error de conexión al agregar POI');
        }
    }

    async addPOIByCoordinates() {
        const name = document.getElementById('newPoiName').value.trim();
        const description = document.getElementById('newPoiDescription').value.trim();
        const whatsapp = document.getElementById('newPoiWhatsapp').value.trim();
        const type = document.getElementById('newPoiType').value;
        const lat = parseFloat(document.getElementById('newPoiLat').value);
        const lng = parseFloat(document.getElementById('newPoiLng').value);
        
        if (!name) {
            alert('El nombre es obligatorio');
            return;
        }
        
        if (isNaN(lat) || isNaN(lng)) {
            alert('Las coordenadas deben ser números válidos');
            return;
        }
        
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            alert('Las coordenadas están fuera del rango válido');
            return;
        }
        
        // Crear nuevo POI
        const newPOI = {
            coords: [lat, lng],
            name: name,
            description: description,
            whatsapp: whatsapp,
            type: type,
            icon: this.availableIcons[type] || this.availableIcons.other,
            color: this.getColorForType(type)
        };
        
        console.log('Agregando POI por coordenadas:', newPOI);
        
        try {
            // Guardar en el servidor
            const response = await fetch('save-pois.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPOI)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Agregar marcador al mapa con el ID del servidor
                const poiWithId = result.data;
                const marker = this.addMarkerToMap(poiWithId);
                
                if (marker) {
                    console.log('✅ Marcador agregado exitosamente por coordenadas al mapa y servidor');
                    
                    // Limpiar formulario
                    this.cancelAddingPOI();
                    
                    // Centrar el mapa en la nueva ubicación
                    this.map.setView([lat, lng], 16);
                    
                    this.showLocationMessage('success', 'Punto de interés agregado y guardado en el servidor');
                } else {
                    console.error('❌ Error al agregar marcador al mapa');
                    this.showLocationMessage('error', 'Error al mostrar el marcador');
                }
            } else {
                console.error('❌ Error guardando POI en servidor:', result.message);
                this.showLocationMessage('error', 'Error al guardar: ' + result.message);
            }
        } catch (error) {
            console.error('❌ Error de red:', error);
            this.showLocationMessage('error', 'Error de conexión al agregar POI');
        }
    }

    cancelAddingPOI() {
        this.addingMode = false;
        
        // Restaurar cursor del mapa
        this.map.getContainer().style.cursor = '';
        
        // Remover evento de clic
        this.map.off('click');
        
        // Limpiar formulario
        document.getElementById('newPoiName').value = '';
        document.getElementById('newPoiDescription').value = '';
        document.getElementById('newPoiWhatsapp').value = '';
        document.getElementById('newPoiLat').value = '';
        document.getElementById('newPoiLng').value = '';
        document.getElementById('useCoordinates').checked = false;
        
        this.toggleCoordinatesMode();
    }

    toggleCoordinatesMode() {
        const useCoordinates = document.getElementById('useCoordinates');
        const coordinatesSection = document.getElementById('coordinatesSection');
        const startBtn = document.getElementById('startAddingPOI');
        const addCoordsBtn = document.getElementById('addNewPOICoords');
        
        if (useCoordinates.checked) {
            coordinatesSection.style.display = 'block';
            startBtn.textContent = 'Agregar en el Mapa';
            startBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Agregar en el Mapa';
        } else {
            coordinatesSection.style.display = 'none';
            startBtn.textContent = 'Agregar en el Mapa';
            startBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Agregar en el Mapa';
        }
        
        this.validateAddForm();
    }

    validateAddForm() {
        const name = document.getElementById('newPoiName').value.trim();
        const useCoordinates = document.getElementById('useCoordinates');
        const lat = document.getElementById('newPoiLat').value;
        const lng = document.getElementById('newPoiLng').value;
        
        const hasName = name.length > 0;
        const startBtn = document.getElementById('startAddingPOI');
        const addCoordsBtn = document.getElementById('addNewPOICoords');
        
        if (useCoordinates.checked) {
            // Modo coordenadas: validar coordenadas
            const hasValidCoords = lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
            if (addCoordsBtn) addCoordsBtn.disabled = !hasName || !hasValidCoords;
        } else {
            // Modo mapa: solo validar nombre
            if (startBtn) startBtn.disabled = !hasName;
        }
    }

    getColorForType(type) {
        const colors = {
            hotel: '#e74c3c',
            restaurant: '#f39c12',
            shop: '#9b59b6',
            hospital: '#e67e22',
            school: '#3498db',
            police: '#2c3e50',
            church: '#9b59b6',
            park: '#27ae60',
            bank: '#f39c12',
            gas_station: '#e74c3c',
            pharmacy: '#e67e22',
            cafe: '#8e44ad',
            bar: '#d35400',
            fast_food: '#f39c12',
            hostel: '#e74c3c',
            camping: '#27ae60',
            other: '#95a5a6'
        };
        
        return colors[type] || '#667eea';
    }

    // ==========================================
    // Gestión de Marcadores
    // ==========================================
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
            
            // Configurar eventos según el modo
            if (this.editMode) {
                marker.on('click', () => {
                    this.selectMarker(marker);
                });
                
                if (marker.dragging) {
                    marker.dragging.enable();
                }
                marker.getElement().classList.add('marker-editable');
            } else {
                marker.on('click', () => {
                    marker.openPopup();
                });
            }
            
            return marker;
        } catch (error) {
            console.error('Error en addMarkerToMap:', error);
            return null;
        }
    }

    updateMarkerPopup(marker) {
        const poiData = marker.poiData;
        const coords = marker.getLatLng();
        
        let popupContent = `
            <div style="text-align: center; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: ${poiData.color};">
                    ${poiData.name}
                </h3>
        `;
        
        if (poiData.description) {
            popupContent += `<p style="margin: 5px 0; font-size: 14px; color: #666;">${poiData.description}</p>`;
        }
        
        if (poiData.whatsapp) {
            popupContent += `
                <p style="margin: 5px 0; font-size: 14px;">
                    <a href="https://wa.me/57${poiData.whatsapp.replace(/\D/g, '')}" 
                       target="_blank" 
                       style="color: #25d366; text-decoration: none; font-weight: 500;">
                        <i class="fab fa-whatsapp"></i> ${poiData.whatsapp}
                    </a>
                </p>
            `;
        }
        
        popupContent += `
                <p style="margin: 5px 0; font-size: 12px; color: #888;">
                    <i class="fas fa-map-marker-alt"></i> ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}
                </p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    }

    // ==========================================
    // Cargar POIs desde el Servidor
    // ==========================================
    async loadSavedPOIs() {
        try {
            console.log('🔄 Cargando POIs desde el servidor...');
            
            // Intentar cargar desde el servidor
            const response = await fetch('save-pois.php');
            const result = await response.json();
            
            if (result.success && result.data) {
                const pois = result.data;
                console.log('✅ POIs obtenidos del servidor:', pois);
                console.log('📊 Cantidad de POIs a cargar:', pois.length);
                
                if (pois.length === 0) {
                    console.log('⚠️ No hay POIs en el servidor, cargando POIs originales');
                    this.addPointsOfInterest();
                    return [];
                }
                
                // Cargar cada POI
                pois.forEach((poiData, index) => {
                    console.log(`📍 Cargando POI ${index + 1}:`, poiData);
                    
                    // Validar datos del POI
                    if (!poiData.name) {
                        console.error(`❌ POI ${index + 1} no tiene nombre, saltando...`);
                        return;
                    }
                    
                    if (!poiData.coords || !Array.isArray(poiData.coords) || poiData.coords.length !== 2) {
                        console.error(`❌ POI ${index + 1} tiene coordenadas inválidas:`, poiData.coords);
                        return;
                    }
                    
                    // Asegurar propiedades requeridas
                    poiData.id = poiData.id || 'poi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    poiData.type = poiData.type || 'other';
                    poiData.icon = poiData.icon || 'fas fa-map-marker-alt';
                    poiData.color = poiData.color || '#3498db';
                    poiData.description = poiData.description || '';
                    poiData.whatsapp = poiData.whatsapp || '';
                    
                    const marker = this.addMarkerToMap(poiData);
                    if (marker) {
                        console.log(`✅ POI ${index + 1} cargado exitosamente: ${poiData.name}`);
                    } else {
                        console.error(`❌ Error cargando POI ${index + 1}`);
                    }
                });
                
                console.log('🎯 Total marcadores después de cargar:', this.markers.length);
                
                if (this.markers.length === 0) {
                    console.log('⚠️ No se cargaron marcadores, cargando POIs originales');
                    this.addPointsOfInterest();
                }
                
                return pois;
                
            } else {
                console.log('❌ Error obteniendo POIs del servidor:', result.message);
                console.log('📭 Cargando POIs originales como fallback');
                this.addPointsOfInterest();
                return [];
            }
            
        } catch (error) {
            console.error('❌ Error de red cargando POIs:', error);
            console.log('📭 Cargando POIs originales como fallback');
            this.addPointsOfInterest();
            return [];
        }
    }

    addPointsOfInterest() {
        console.log('📍 Cargando puntos de interés originales...');
        
        pointsOfInterest.forEach(poi => {
            const marker = this.addMarkerToMap(poi);
            if (marker) {
                console.log(`✅ POI original cargado: ${poi.name}`);
            }
        });
        
        console.log('🎯 Total marcadores originales cargados:', this.markers.length);
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
    // Funciones de Persistencia con Backend
    // ==========================================

    async savePOIsToStorage() {
        try {
            console.log('💾 Iniciando guardado de POIs al servidor...');
            console.log('📊 Total marcadores a guardar:', this.markers ? this.markers.length : 'UNDEFINED');
            
            if (!this.markers || this.markers.length === 0) {
                console.log('⚠️ No hay marcadores para guardar');
                return false;
            }
            
            // Preparar todos los POIs
            const allPOIs = this.markers.map((marker, index) => {
                try {
                    const coords = marker.getLatLng();
                    const poiData = {
                        id: marker.poiData.id || 'poi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        coords: [coords.lat, coords.lng],
                        name: marker.poiData.name || marker.poiData.nameKey || 'Punto de interés',
                        description: marker.poiData.description || '',
                        whatsapp: marker.poiData.whatsapp || '',
                        icon: marker.poiData.icon || 'fas fa-map-marker-alt',
                        color: marker.poiData.color || '#3498db',
                        type: marker.poiData.type || 'other'
                    };
                    
                    console.log(`📍 POI ${index + 1} preparado para guardar:`, poiData);
                    return poiData;
                } catch (error) {
                    console.error(`❌ Error procesando marcador ${index + 1}:`, error);
                    return null;
                }
            }).filter(poi => poi !== null);

            console.log('✅ POIs procesados:', allPOIs);
            
            // Guardar cada POI individualmente al servidor
            let successCount = 0;
            let errorCount = 0;
            
            for (const poi of allPOIs) {
                try {
                    const response = await fetch('save-pois.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(poi)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        successCount++;
                        console.log(`✅ POI guardado en servidor: ${poi.name}`);
                    } else {
                        errorCount++;
                        console.error(`❌ Error guardando POI: ${result.message}`);
                    }
                } catch (error) {
                    errorCount++;
                    console.error(`❌ Error de red guardando POI: ${error.message}`);
                }
            }
            
            console.log(`📊 Resultado del guardado: ${successCount} exitosos, ${errorCount} errores`);
            
            if (errorCount === 0) {
                console.log('✅ Todos los POIs guardados exitosamente en el servidor');
                return true;
            } else if (successCount > 0) {
                console.log('⚠️ Algunos POIs se guardaron con errores');
                return true;
            } else {
                console.error('❌ No se pudo guardar ningún POI');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error al guardar POIs:', error);
            return false;
        }
    }

    // ==========================================
    // Gestión de Lista de POIs
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
            
            const poiData = marker.poiData;
            const coords = marker.getLatLng();
            
            poiItem.innerHTML = `
                <div class="poi-name">${poiData.name || 'Sin nombre'}</div>
                <div class="poi-details">
                    ${poiData.description || 'Sin descripción'} | 
                    ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}
                </div>
                ${poiData.whatsapp ? `<div class="poi-whatsapp">📱 ${poiData.whatsapp}</div>` : ''}
            `;
            
            poiItem.addEventListener('click', () => {
                this.selectMarkerFromList(marker, poiItem);
            });
            
            poiList.appendChild(poiItem);
        });
    }

    selectMarkerFromList(marker, listItem) {
        // Remover selección anterior
        document.querySelectorAll('.poi-list-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Seleccionar nuevo item
        listItem.classList.add('selected');
        
        // Seleccionar marcador
        this.selectMarker(marker);
        
        // Centrar mapa en el marcador
        this.map.setView(marker.getLatLng(), Math.max(this.map.getZoom(), 16));
    }

    // ==========================================
    // Galería de Iconos
    // ==========================================
    showIconGallery() {
        const iconGallery = document.getElementById('iconGallery');
        const iconGrid = document.getElementById('iconGrid');
        
        if (!iconGallery || !iconGrid) return;
        
        // Limpiar grid
        iconGrid.innerHTML = '';
        
        // Agregar iconos
        Object.entries(this.availableIcons).forEach(([type, iconClass]) => {
            const iconOption = document.createElement('div');
            iconOption.className = 'icon-option';
            iconOption.innerHTML = `<i class="${iconClass}"></i>`;
            iconOption.title = type;
            
            iconOption.addEventListener('click', () => {
                this.selectIcon(iconClass);
            });
            
            iconGrid.appendChild(iconOption);
        });
        
        // Mostrar modal
        iconGallery.classList.add('active');
    }

    hideIconGallery() {
        const iconGallery = document.getElementById('iconGallery');
        if (iconGallery) {
            iconGallery.classList.remove('active');
        }
    }

    selectIcon(iconClass) {
        if (!this.selectedMarker) return;
        
        // Actualizar marcador
        this.selectedMarker.poiData.icon = iconClass;
        
        // Actualizar icono visual del marcador
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
        const iconPreview = document.getElementById('iconPreview');
        if (iconPreview) {
            iconPreview.innerHTML = `<i class="${iconClass}"></i>`;
        }
        
        // Ocultar galería
        this.hideIconGallery();
        
        // Guardar cambios
        this.savePOIsToStorage();
        
        this.showLocationMessage('success', 'Icono actualizado');
    }
}

// ==========================================
// Inicialización
// ==========================================
let puerresMap;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    puerresMap = new PuerresMap();
    puerresMap.init();
});
