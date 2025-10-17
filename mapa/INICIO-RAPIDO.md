# 🚀 Inicio Rápido - Mapa de Puerres PWA

## ⚡ En 3 Pasos

### 1️⃣ Probar Localmente

**Con Python (más fácil):**
```bash
# Abrir terminal en la carpeta del proyecto
cd ruta/a/tu/proyecto

# Iniciar servidor
python -m http.server 8000

# Abrir en navegador
# http://localhost:8000
```

**Con Node.js:**
```bash
npx http-server -p 8000
```

**Con PHP:**
```bash
php -S localhost:8000
```

**Con Visual Studio Code:**
1. Instalar extensión "Live Server"
2. Click derecho en `index.html`
3. "Open with Live Server"

---

### 2️⃣ Subir a Hosting

**Opción A: Netlify (GRATIS - Recomendado) 🌟**
1. Ve a https://netlify.com
2. Arrastra la carpeta completa
3. ¡Listo! Tu sitio está en línea con HTTPS

**Opción B: Tu Hosting cPanel**
1. Accede a tu cPanel
2. Administrador de archivos
3. Ve a `public_html/`
4. Sube todos los archivos
5. Activa SSL (Let's Encrypt)

**Opción C: Vercel (GRATIS)**
```bash
npx vercel --prod
```

---

### 3️⃣ Personalizar

**Cambiar ubicación del mapa:**
```javascript
// Editar: js/map.js
const PUERRES_CENTER = [TU_LATITUD, TU_LONGITUD];
```

**Añadir puntos de interés:**
```javascript
// Editar: js/map.js → array pointsOfInterest
{
    id: 'nuevo-lugar',
    coords: [latitud, longitud],
    nameKey: 'nombreClave',
    descKey: 'descripcionClave',
    icon: 'map-pin',  // icono de Font Awesome
    color: '#e74c3c'
}
```

**Agregar traducciones:**
```javascript
// Editar: js/translations.js
const translations = {
    es: {
        nombreClave: "Tu texto en español",
        descripcionClave: "Descripción en español"
    },
    en: {
        nombreClave: "Your text in English",
        descripcionClave: "Description in English"
    }
};
```

---

## 📱 Probar en Móvil

### Opción 1: Mismo WiFi
1. Inicia servidor local (paso 1)
2. En el móvil, conecta al mismo WiFi
3. Abre: `http://IP-DE-TU-PC:8000`
   - Windows: `ipconfig` → busca "IPv4"
   - Mac/Linux: `ifconfig` → busca "inet"

### Opción 2: ngrok (Túnel HTTPS)
```bash
# Instalar ngrok
npm install -g ngrok

# En una terminal: inicia tu servidor local
python -m http.server 8000

# En otra terminal: crea túnel
ngrok http 8000

# Copia la URL HTTPS generada
# Ejemplo: https://abc123.ngrok.io
```

---

## ⚙️ Personalización Rápida

### Cambiar Colores
```css
/* Editar: css/style.css */
:root {
    --primary-color: #TU_COLOR;
    --secondary-color: #TU_COLOR;
    --accent-color: #TU_COLOR;
}
```

### Cambiar Nombre de la App
```json
// Editar: manifest.json
{
    "name": "Tu Nuevo Nombre",
    "short_name": "Nombre Corto"
}
```

### Cambiar Iconos
1. Lee: `GENERAR-ICONOS.md`
2. Genera PNG reales
3. Reemplaza en carpeta `icons/`

---

## 🔍 Verificar que Todo Funciona

### Checklist Rápido:
- [ ] Sitio carga en navegador
- [ ] Mapa se muestra
- [ ] Marcadores aparecen
- [ ] Cambio de idioma funciona
- [ ] No hay errores en consola (F12)

### Test de PWA (en HTTPS):
- [ ] Aparece botón "Instalar App"
- [ ] Se puede instalar
- [ ] Funciona offline

---

## 🆘 Problemas Comunes

### "El mapa no carga"
✅ Verifica conexión a internet
✅ Revisa consola del navegador (F12)

### "No aparece el botón de instalación"
✅ Debes estar en HTTPS (no funciona en HTTP local)
✅ Usa ngrok para pruebas con HTTPS localmente

### "Cambio de idioma no funciona"
✅ Revisa la consola para errores
✅ Verifica que `translations.js` se cargue

### "Los iconos no se ven"
✅ Genera PNG reales (ver GENERAR-ICONOS.md)
✅ Verifica rutas en manifest.json

---

## 📚 Más Información

- **README.md** → Documentación completa
- **INSTALACION.md** → Guía detallada de instalación
- **VERIFICACION.md** → Checklist completo de testing
- **GENERAR-ICONOS.md** → Cómo crear iconos

---

## 🎯 Próximos Pasos

1. ✅ Probar localmente
2. ✅ Personalizar ubicación y puntos de interés
3. ✅ Generar iconos PNG reales
4. ✅ Subir a hosting con HTTPS
5. ✅ Probar instalación en móvil
6. ✅ Compartir con los visitantes

---

## 💡 Tips Profesionales

### Actualizar Contenido
Cuando hagas cambios:
1. Edita los archivos necesarios
2. **Importante:** Cambia la versión en `service-worker.js`
   ```javascript
   const CACHE_NAME = 'puerres-map-v2'; // v1 → v2
   ```
3. Sube los archivos al servidor
4. Los usuarios verán la actualización al recargar

### Optimizar Imágenes/Iconos
Usa TinyPNG para comprimir:
- https://tinypng.com
- Arrastra tus PNG
- Descarga versiones optimizadas

### Monitorear Uso
Añade Google Analytics (opcional):
```html
<!-- En index.html, antes de </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID');
</script>
```

---

## 🌟 ¡Listo para Producción!

Tu PWA del Mapa de Puerres está lista para ser usada por visitantes de todo el mundo.

**Características incluidas:**
- ✅ Funciona offline
- ✅ Se puede instalar como app
- ✅ Bilingüe (Español/Inglés)
- ✅ Responsive (móvil, tablet, desktop)
- ✅ Rápida y optimizada
- ✅ Profesional y moderna

**¡Éxito con tu proyecto!** 🚀🇨🇴

---

**¿Preguntas?** Consulta los otros archivos .md o contacta al soporte técnico.


