# 🗺️ Mapa de Puerres - PWA

Progressive Web App (PWA) del mapa interactivo del municipio de Puerres, Nariño, Colombia.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Características

✅ **Progressive Web App (PWA)** - Se puede instalar como aplicación nativa  
✅ **Funciona Offline** - Service Worker cachea todos los recursos necesarios  
✅ **Bilingüe** - Español e Inglés con cambio dinámico  
✅ **Responsive** - Adapta perfectamente a móviles, tablets y desktop  
✅ **Mapa Interactivo** - Basado en Leaflet y OpenStreetMap  
✅ **Geolocalización** - Encuentra tu ubicación actual  
✅ **Puntos de Interés** - Marcadores con información de lugares importantes  

## 🏗️ Estructura del Proyecto

```
mapa/
├── index.html              # Página principal
├── manifest.json           # Configuración PWA
├── service-worker.js       # Service Worker para modo offline
├── css/
│   └── style.css          # Estilos responsivos
├── js/
│   ├── app.js             # Aplicación principal
│   ├── map.js             # Lógica del mapa
│   └── translations.js    # Sistema bilingüe
├── icons/                 # Iconos de la PWA
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md
```

## 🚀 Instalación en Hosting

### Opción 1: Hosting Tradicional (cPanel, DirectAdmin, etc.)

1. **Comprimir el proyecto:**
   ```bash
   # En Windows (PowerShell)
   Compress-Archive -Path * -DestinationPath puerres-map.zip
   
   # En Linux/Mac
   zip -r puerres-map.zip *
   ```

2. **Subir al hosting:**
   - Accede a tu panel de control (cPanel, DirectAdmin, etc.)
   - Ve al administrador de archivos
   - Navega a la carpeta `public_html` o `www`
   - Sube el archivo ZIP
   - Descomprime el archivo

3. **Configurar dominio:**
   - Asegúrate de que el dominio apunte a la carpeta donde subiste los archivos
   - Accede a `https://tudominio.com`

### Opción 2: Hosting Estático (Netlify, Vercel, GitHub Pages)

#### Netlify (Recomendado - Gratuito)

1. **Crear cuenta en [Netlify](https://netlify.com)**

2. **Subir manualmente:**
   - Arrastra la carpeta completa a Netlify Drop
   - Tu sitio estará en línea en segundos

3. **O usar Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

#### Vercel

```bash
npm install -g vercel
vercel --prod
```

#### GitHub Pages

1. Crea un repositorio en GitHub
2. Sube los archivos
3. Ve a Settings → Pages
4. Selecciona la rama `main` como source
5. Tu sitio estará en `https://usuario.github.io/repositorio`

## 📱 Generar Iconos de PWA

Los iconos incluidos son SVG temporales. Para producción, genera iconos PNG reales:

### Usando una herramienta online:
1. Ve a [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
2. Sube un logo de 512x512px
3. Descarga todos los tamaños
4. Reemplaza en la carpeta `icons/`

### Usando línea de comandos (Node.js):
```bash
npx pwa-asset-generator logo.png icons/ --background "#2c3e50"
```

## 🌐 Configuración del Dominio

### Requisitos para PWA:
- ✅ **HTTPS obligatorio** (la mayoría de hostings modernos lo incluyen gratis con Let's Encrypt)
- ✅ Service Worker solo funciona en HTTPS o localhost

### Verificar HTTPS:
1. Accede a tu hosting
2. Busca "SSL/TLS" o "Certificado SSL"
3. Activa Let's Encrypt (gratuito) o sube tu certificado

## 📝 Personalización

### Cambiar coordenadas del mapa:
Edita `js/map.js`:
```javascript
const PUERRES_CENTER = [1.4667, -77.2833]; // Tu ubicación
const DEFAULT_ZOOM = 15;
```

### Añadir puntos de interés:
Edita `js/map.js` en la sección `pointsOfInterest`:
```javascript
{
    id: 'nuevo-lugar',
    coords: [latitud, longitud],
    nameKey: 'nombreKey',
    descKey: 'descripcionKey',
    icon: 'fas-icon-name',
    color: '#color-hex'
}
```

### Agregar traducciones:
Edita `js/translations.js`:
```javascript
const translations = {
    es: {
        nombreKey: "Nombre en español",
        // ...
    },
    en: {
        nombreKey: "Name in English",
        // ...
    }
};
```

### Modificar colores:
Edita `css/style.css` en las variables CSS:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    /* ... */
}
```

## 🧪 Pruebas Locales

### Opción 1: Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Accede a: `http://localhost:8000`

### Opción 2: Node.js
```bash
npx http-server -p 8000
```

### Opción 3: PHP
```bash
php -S localhost:8000
```

### Opción 4: Live Server (VS Code)
1. Instala la extensión "Live Server"
2. Click derecho en `index.html`
3. "Open with Live Server"

## 📊 Auditoría PWA

Usa Lighthouse en Chrome DevTools:
1. Abre Chrome DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Progressive Web App"
4. Click en "Generate report"

**Objetivo: 90-100 puntos** ✅

## 🔧 Solución de Problemas

### El Service Worker no se registra:
- ✅ Verifica que estés en HTTPS o localhost
- ✅ Revisa la consola del navegador (F12)
- ✅ El path del Service Worker debe ser correcto

### El botón de instalación no aparece:
- ✅ Debe estar en HTTPS
- ✅ Debe tener un manifest.json válido
- ✅ Debe tener un Service Worker registrado
- ✅ En algunos navegadores móviles aparece automáticamente

### El mapa no carga:
- ✅ Verifica conexión a internet (primera vez)
- ✅ Revisa la consola del navegador
- ✅ Comprueba que Leaflet se cargue correctamente

### No funciona offline:
- ✅ Visita la página al menos una vez con internet
- ✅ Verifica que el Service Worker esté activo
- ✅ Revisa en DevTools → Application → Service Workers

## 📱 Instalación para Usuarios

### Android (Chrome):
1. Abre el sitio web
2. Toca el menú (⋮)
3. "Añadir a pantalla de inicio"
4. Confirma

### iOS (Safari):
1. Abre el sitio web en Safari
2. Toca el botón compartir (□↑)
3. "Añadir a la pantalla de inicio"
4. Confirma

### Desktop (Chrome, Edge, etc.):
1. Busca el ícono de instalación en la barra de direcciones ⊕
2. Click en "Instalar"

## 🌍 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsive
- **JavaScript (ES6+)** - Funcionalidad interactiva
- **Leaflet.js** - Mapas interactivos
- **OpenStreetMap** - Datos cartográficos
- **Service Workers** - Funcionalidad offline
- **Web App Manifest** - Capacidades de PWA
- **Font Awesome** - Iconos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usar, modificar y distribuir.

## 🤝 Contribuir

¿Encontraste un error? ¿Tienes una sugerencia?
- Abre un issue
- Envía un pull request
- Contacta al desarrollador

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: tu-email@ejemplo.com
- 🌐 Web: tudominio.com
- 📱 WhatsApp: +57 XXX XXX XXXX

---

**Desarrollado con ❤️ para el municipio de Puerres, Nariño, Colombia**

🇨🇴 Versión 1.0.0 - 2025


