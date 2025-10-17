# 🗺️ Mapa de Puerres - CIASE

Una aplicación web progresiva (PWA) que proporciona un mapa interactivo del municipio de Puerres, Nariño, Colombia.

## ✨ Características

### 🎯 Funcionalidades Principales
- **Mapa Interactivo**: Visualización completa de Puerres con Leaflet.js
- **Geolocalización**: Encuentra tu ubicación actual con precisión GPS
- **Múltiples Capas**: Cambio entre mapas estándar, satélite, terreno y modo oscuro
- **Puntos de Interés**: POIs predefinidos y personalizables
- **Modo de Edición**: Panel administrativo para gestionar POIs

### 🛠️ Funcionalidades de Edición
- **Agregar POIs**: Nuevos puntos de interés por clic en el mapa o coordenadas
- **Editar POIs**: Modificar nombre, descripción, WhatsApp y ubicación
- **Eliminar POIs**: Remover puntos de interés no deseados
- **Iconos Personalizables**: Galería de iconos para diferentes tipos de POIs
- **Persistencia**: Todos los cambios se guardan automáticamente

### 📱 PWA (Progressive Web App)
- **Instalable**: Se puede instalar como app nativa
- **Offline**: Funciona sin conexión a internet
- **Responsive**: Optimizado para móviles, tablets y escritorio
- **Actualizaciones**: Sistema automático de actualizaciones

### 🔐 Seguridad
- **Autenticación**: Panel de edición protegido con usuario/contraseña
- **Validación**: Verificación de datos en formularios
- **Sanitización**: Prevención de inyección de código

## 🚀 Instalación

### Requisitos
- Servidor web (Apache, Nginx, etc.)
- PHP 7.4+ (opcional)
- Certificado SSL (recomendado para PWA)

### Pasos de Instalación

1. **Clonar/Descargar**:
   ```bash
   git clone [repository-url]
   # o descargar y extraer el ZIP
   ```

2. **Subir archivos**:
   - Subir todos los archivos al directorio raíz de tu servidor web
   - Asegurar que el archivo `.htaccess` esté presente

3. **Configurar permisos**:
   ```bash
   chmod 644 *
   chmod 755 css/ js/ icons/ screenshots/
   ```

4. **Verificar instalación**:
   - Visitar `https://tudominio.com/`
   - Verificar que el mapa se carga correctamente
   - Probar la funcionalidad de geolocalización

## 🔧 Configuración

### Credenciales de Administración
- **Usuario**: `ciase`
- **Contraseña**: `ciase123`

### Personalización de POIs
Los puntos de interés originales están definidos en `js/map.js`:

```javascript
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
    // ... más POIs
];
```

### Configuración del Mapa
- **Centro**: Puerres, Nariño (0.883159, -77.504078)
- **Zoom inicial**: 15
- **Capas disponibles**: OpenStreetMap, Satélite, Terreno, Oscuro

## 📱 Uso

### Navegación Básica
1. **Explorar**: Usa el mouse o touch para navegar por el mapa
2. **Zoom**: Rueda del mouse, botones +/- o pellizcar en móvil
3. **Ubicación**: Botón de geolocalización (esquina superior derecha)
4. **Capas**: Selector de tipo de mapa (esquina superior izquierda)

### Edición de POIs
1. **Activar edición**: Botón "Editar" (esquina inferior derecha)
2. **Autenticación**: Ingresar usuario y contraseña
3. **Agregar POI**:
   - Tab "Agregar"
   - Llenar formulario
   - Clic en "Agregar en el Mapa" y hacer clic en el mapa
   - O usar "Agregar por Coordenadas"
4. **Editar POI**:
   - Clic en un marcador existente
   - Modificar datos en el panel
   - Clic en "Actualizar"
5. **Eliminar POI**:
   - Seleccionar marcador
   - Clic en "Eliminar"

### Instalación como PWA
1. **Chrome/Edge**: Icono "+" en la barra de direcciones
2. **Firefox**: Menú → "Instalar"
3. **Safari**: Compartir → "Agregar a pantalla de inicio"

## 🛠️ Desarrollo

### Estructura del Proyecto
```
/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos CSS
├── js/
│   ├── map.js             # Lógica del mapa
│   └── app.js             # Funcionalidad PWA
├── icons/                 # Iconos de la aplicación
├── screenshots/           # Capturas para la tienda
├── service-worker.js      # Service Worker
├── manifest.json          # Manifest de PWA
├── .htaccess             # Configuración del servidor
└── README.md             # Este archivo
```

### Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox/Grid
- **JavaScript ES6+**: Lógica de la aplicación
- **Leaflet.js**: Biblioteca de mapas
- **Font Awesome**: Iconografía
- **Service Worker**: Funcionalidad offline

### Personalización

#### Agregar Nuevos Tipos de POIs
En `js/map.js`, modificar el objeto `availableIcons`:

```javascript
this.availableIcons = {
    // ... iconos existentes
    nuevo_tipo: 'fas fa-nuevo-icono',
    // ... más iconos
};
```

#### Cambiar Colores por Tipo
En la función `getColorForType()`:

```javascript
getColorForType(type) {
    const colors = {
        // ... colores existentes
        nuevo_tipo: '#color-hex',
        // ... más colores
    };
    return colors[type] || '#667eea';
}
```

#### Modificar Coordenadas del Centro
En `js/map.js`:

```javascript
const PUERRES_CENTER = [lat, lng]; // Nueva ubicación
```

## 🔍 Solución de Problemas

### Problemas Comunes

#### El mapa no se carga
- Verificar conexión a internet
- Comprobar que Leaflet.js se carga correctamente
- Revisar la consola del navegador (F12)

#### La geolocalización no funciona
- Verificar permisos del navegador
- Asegurar que el sitio use HTTPS
- Comprobar que el GPS esté activado en móvil

#### Los POIs no se guardan
- Verificar que localStorage esté habilitado
- Comprobar la consola para errores JavaScript
- Usar la función `diagnosticarGuardado()` en la consola

#### La PWA no se instala
- Verificar que el sitio use HTTPS
- Comprobar que el manifest.json sea válido
- Asegurar que el Service Worker esté registrado

### Debugging

#### Consola del Navegador
```javascript
// Diagnosticar guardado de POIs
diagnosticarGuardado();

// Verificar estado del Service Worker
navigator.serviceWorker.getRegistration().then(reg => {
    console.log('SW registrado:', reg);
});

// Limpiar caché manualmente
caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
});
```

## 📄 Licencia

Este proyecto es propiedad de **R.I Gran Tescual - CIASE**.

## 👥 Créditos

- **Desarrollado por**: CIASE
- **Administrador**: antoniopantojac@gmail.com
- **Ubicación**: Puerres, Nariño, Colombia

## 🔄 Actualizaciones

### Versión 1.0.0
- ✅ Mapa interactivo completo
- ✅ Sistema de edición de POIs
- ✅ PWA funcional
- ✅ Diseño responsivo
- ✅ Geolocalización
- ✅ Múltiples capas de mapa

---

**© 2025 R.I Gran Tescual - CIASE | Adm. antoniopantojac@gmail.com**
