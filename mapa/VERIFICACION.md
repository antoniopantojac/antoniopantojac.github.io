# ✅ Lista de Verificación - PWA Mapa de Puerres

## 📋 Pre-Despliegue

### Archivos Principales
- [ ] `index.html` existe y es válido
- [ ] `manifest.json` existe y es válido JSON
- [ ] `service-worker.js` existe
- [ ] Carpeta `css/` con `style.css`
- [ ] Carpeta `js/` con `app.js`, `map.js`, `translations.js`
- [ ] Carpeta `icons/` con todos los tamaños de iconos

### Iconos PWA
- [ ] icon-72x72.png
- [ ] icon-96x96.png
- [ ] icon-128x128.png
- [ ] icon-144x144.png
- [ ] icon-152x152.png
- [ ] icon-192x192.png
- [ ] icon-384x384.png
- [ ] icon-512x512.png

⚠️ **Importante:** Los iconos incluidos son SVG temporales. Para producción, genera PNG reales. Ver `GENERAR-ICONOS.md`

### Configuración
- [ ] URLs del proyecto actualizadas en `manifest.json`
- [ ] Nombre de la app correcto en `manifest.json`
- [ ] Coordenadas del mapa configuradas en `js/map.js`
- [ ] Puntos de interés personalizados añadidos

---

## 🌐 Post-Despliegue (en servidor)

### Acceso Básico
- [ ] El sitio carga correctamente en `https://tudominio.com`
- [ ] No hay errores 404 en recursos
- [ ] No hay errores en la consola del navegador (F12)

### HTTPS
- [ ] El sitio usa HTTPS (no HTTP)
- [ ] Aparece candado 🔒 en la barra de direcciones
- [ ] Certificado SSL válido y no expirado

### PWA - Manifest
- [ ] Abrir DevTools → Application → Manifest
- [ ] El manifest se carga correctamente
- [ ] Los iconos se muestran en la vista previa
- [ ] El nombre y descripción son correctos

### PWA - Service Worker
- [ ] Abrir DevTools → Application → Service Workers
- [ ] El service worker aparece como "activated and running"
- [ ] No hay errores en el registro
- [ ] El estado es verde ✓

### Instalación
- [ ] El botón "Instalar App" aparece en la página
- [ ] En móvil, aparece el banner de instalación
- [ ] La app se puede instalar correctamente
- [ ] Al instalar, se abre en ventana independiente
- [ ] El icono de la app se ve correctamente

### Funcionalidad del Mapa
- [ ] El mapa se carga y se muestra correctamente
- [ ] Se pueden ver los tiles (imágenes del mapa)
- [ ] Los marcadores de puntos de interés aparecen
- [ ] Los popups se abren al hacer click en marcadores
- [ ] Las líneas de calles se muestran
- [ ] Zoom funciona correctamente
- [ ] Pan/arrastre funciona

### Controles del Mapa
- [ ] Botón "Mi ubicación" funciona (pide permisos)
- [ ] Botón "Vista inicial" resetea la vista
- [ ] Controles de zoom +/- funcionan

### Bilingüe
- [ ] Botón de cambio de idioma aparece
- [ ] Click cambia entre ES ↔ EN
- [ ] El indicador muestra el idioma actual
- [ ] Todos los textos cambian de idioma
- [ ] Los popups del mapa cambian de idioma
- [ ] El idioma se guarda (persiste al recargar)

### Estado Online/Offline
- [ ] Con internet, muestra "En línea" / "Online"
- [ ] Sin internet, muestra "Sin conexión" / "Offline"
- [ ] El indicador cambia dinámicamente

### Modo Offline
- [ ] Visitar el sitio con internet (primera vez)
- [ ] Desactivar WiFi/datos móviles
- [ ] Recargar la página (F5 o Ctrl+R)
- [ ] La página carga completamente
- [ ] El mapa base funciona
- [ ] Los controles funcionan
- [ ] Solo fallarán tiles nuevos del mapa

### Responsive Design
#### Desktop (1920x1080)
- [ ] El layout se ve bien
- [ ] El mapa ocupa espacio adecuado
- [ ] No hay scroll horizontal

#### Tablet (768x1024)
- [ ] El diseño se adapta
- [ ] Los elementos se reorganizan
- [ ] Todo es legible y accesible

#### Móvil (375x667)
- [ ] El diseño mobile funciona
- [ ] El header se adapta
- [ ] El mapa es usable
- [ ] Los botones son tocables (min 44x44px)
- [ ] No hay texto cortado

---

## 🔍 Auditoría con Lighthouse

### Ejecutar Auditoría:
1. Abrir Chrome DevTools (F12)
2. Ir a pestaña "Lighthouse"
3. Seleccionar:
   - ☑ Performance
   - ☑ Accessibility
   - ☑ Best Practices
   - ☑ **PWA**
   - ☑ SEO
4. Click "Generate report"

### Objetivos de Puntuación:
- [ ] **Performance:** 80+ (verde)
- [ ] **Accessibility:** 90+ (verde)
- [ ] **Best Practices:** 90+ (verde)
- [ ] **PWA:** 100 ✓ (todos los checks)
- [ ] **SEO:** 90+ (verde)

### PWA Checklist (Lighthouse):
- [ ] ✅ Registers a service worker
- [ ] ✅ Responds with 200 when offline
- [ ] ✅ Has a web app manifest
- [ ] ✅ Configured for a custom splash screen
- [ ] ✅ Sets an address-bar theme color
- [ ] ✅ Content sized correctly for viewport
- [ ] ✅ Has a `<meta name="viewport">` tag
- [ ] ✅ Provides a valid `apple-touch-icon`

---

## 🧪 Pruebas Manuales

### Prueba de Instalación (Android)
1. [ ] Abrir en Chrome móvil
2. [ ] Aparece mini-infobar de instalación
3. [ ] Tocar "Instalar"
4. [ ] La app se añade a la pantalla de inicio
5. [ ] El icono se ve correctamente
6. [ ] Abrir desde pantalla de inicio
7. [ ] Se abre en modo standalone (sin barra del navegador)

### Prueba de Instalación (iOS)
1. [ ] Abrir en Safari (no Chrome)
2. [ ] Tocar botón compartir
3. [ ] "Añadir a pantalla de inicio"
4. [ ] El icono se ve correctamente
5. [ ] Abrir desde pantalla de inicio
6. [ ] Se abre en modo standalone

### Prueba de Instalación (Desktop)
1. [ ] Abrir en Chrome/Edge
2. [ ] Buscar icono ⊕ en barra de direcciones
3. [ ] Click "Instalar"
4. [ ] Se abre en ventana independiente
5. [ ] Aparece en aplicaciones del sistema

### Prueba de Navegación
1. [ ] Cargar la página inicial
2. [ ] Cambiar idioma → funciona
3. [ ] Click en marcador → se abre popup
4. [ ] Cambiar zoom → funciona
5. [ ] Arrastrar mapa → funciona
6. [ ] Click "Mi ubicación" → pide permisos
7. [ ] Click "Vista inicial" → resetea

### Prueba Offline Completa
1. [ ] Visitar sitio con internet
2. [ ] Esperar que cargue todo (10 segundos)
3. [ ] Activar modo avión
4. [ ] Cerrar la app/pestaña
5. [ ] Abrir de nuevo
6. [ ] La app carga
7. [ ] El mapa funciona (con tiles cacheados)
8. [ ] Los controles funcionan
9. [ ] Cambio de idioma funciona
10. [ ] Solo fallan tiles no visitados antes

### Prueba de Reconexión
1. [ ] En modo offline
2. [ ] Reactivar internet
3. [ ] El indicador cambia a "En línea"
4. [ ] Los tiles nuevos cargan

---

## 🐛 Problemas Comunes y Soluciones

### ❌ El Service Worker no se registra
**Síntomas:** Error en consola, no funciona offline
**Soluciones:**
- [ ] Verificar que estás en HTTPS o localhost
- [ ] Comprobar ruta del service-worker.js (debe estar en la raíz)
- [ ] Revisar errores en la consola
- [ ] Limpiar caché y recarga hard (Ctrl+Shift+R)

### ❌ No aparece el botón de instalación
**Síntomas:** No hay opción de instalar
**Soluciones:**
- [ ] Verificar HTTPS activo
- [ ] Comprobar manifest.json válido
- [ ] Verificar que el Service Worker esté registrado
- [ ] Esperar unos segundos (puede tardar)
- [ ] En iOS, usar Safari (no Chrome)

### ❌ El mapa no carga
**Síntomas:** Área gris o errores de Leaflet
**Soluciones:**
- [ ] Verificar conexión a internet (primera vez)
- [ ] Comprobar que Leaflet.js se carga (red en DevTools)
- [ ] Revisar coordenadas en js/map.js
- [ ] Verificar que OpenStreetMap responde

### ❌ Los iconos no se ven
**Síntomas:** Iconos rotos o no aparecen
**Soluciones:**
- [ ] Verificar que la carpeta icons/ se subió
- [ ] Comprobar permisos de archivos (644)
- [ ] Generar PNG reales (ver GENERAR-ICONOS.md)
- [ ] Verificar rutas en manifest.json

### ❌ No funciona offline
**Síntomas:** Error "Sin conexión" al desconectar
**Soluciones:**
- [ ] Visitar el sitio al menos una vez con internet
- [ ] Verificar que el Service Worker esté activo
- [ ] Esperar 10-20 segundos en la primera visita
- [ ] Comprobar que los recursos se cachearon (Application → Cache)

### ❌ El idioma no cambia
**Síntomas:** Botón no responde o textos no cambian
**Soluciones:**
- [ ] Verificar que translations.js se cargó
- [ ] Revisar consola para errores de JS
- [ ] Comprobar que los elementos tienen data-translate
- [ ] Limpiar localStorage del navegador

---

## 📊 Métricas de Éxito

### Métricas Técnicas
- ✅ Lighthouse PWA: 100/100
- ✅ Lighthouse Performance: 80+
- ✅ Tiempo de carga: < 3 segundos
- ✅ First Contentful Paint: < 2 segundos
- ✅ Time to Interactive: < 5 segundos

### Métricas de Usuario
- ✅ Tasa de instalación: 10%+
- ✅ Usuarios recurrentes: 30%+
- ✅ Tiempo promedio en sitio: 2+ minutos
- ✅ Tasa de rebote: < 40%

---

## 🎯 Checklist Final Antes de Lanzar

### Contenido
- [ ] Todos los textos están en español e inglés
- [ ] Las coordenadas son correctas para Puerres
- [ ] Los puntos de interés están completos
- [ ] La información de contacto es correcta

### Técnico
- [ ] HTTPS configurado y funcionando
- [ ] DNS apuntando correctamente
- [ ] Service Worker registrado
- [ ] Manifest válido
- [ ] Iconos PNG reales generados
- [ ] Sin errores en consola

### SEO y Redes Sociales
- [ ] Título descriptivo en `<title>`
- [ ] Meta description presente
- [ ] Open Graph tags (opcional)
- [ ] Twitter Cards (opcional)

### Legal (opcional pero recomendado)
- [ ] Política de privacidad
- [ ] Términos de uso
- [ ] Cookies notice (si aplica)
- [ ] GDPR compliance (si aplica)

### Backup
- [ ] Código respaldado (Git/GitHub)
- [ ] Archivos descargados localmente
- [ ] Documentación completa

---

## 📞 Soporte Post-Lanzamiento

### Monitoreo
- [ ] Configurar Google Analytics (opcional)
- [ ] Configurar errores de seguimiento (Sentry, etc.)
- [ ] Revisar logs del servidor semanalmente

### Actualizaciones
- [ ] Cambiar version en `service-worker.js` al actualizar
- [ ] Probar en staging antes de producción
- [ ] Notificar a usuarios de actualizaciones importantes

---

## ✅ ¡Todo Listo!

Si todos los checkmarks están marcados, tu PWA está lista para producción. 🚀

**Última actualización:** Octubre 2025  
**Versión:** 1.0.0


