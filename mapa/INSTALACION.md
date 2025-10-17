# 📲 Guía de Instalación - Mapa de Puerres PWA

## 🎯 Para Usuarios (Visitantes)

### 📱 **Instalar en Android**

1. **Abre el sitio web en Chrome:**
   - Visita: `https://tudominio.com`

2. **Busca el aviso de instalación:**
   - Aparecerá un banner en la parte inferior: "Agregar Mapa de Puerres a la pantalla de inicio"
   - O toca el botón azul "Instalar App" en la parte superior

3. **Instalación manual (si no aparece el banner):**
   - Toca el menú (⋮) en la esquina superior derecha
   - Selecciona "Añadir a pantalla de inicio"
   - Cambia el nombre si quieres (opcional)
   - Toca "Agregar"

4. **¡Listo!** 🎉
   - El icono aparecerá en tu pantalla de inicio
   - Funciona como una app normal
   - Funciona SIN INTERNET después de la primera visita

---

### 🍎 **Instalar en iPhone/iPad**

1. **Abre el sitio en Safari:**
   - Es importante usar Safari, no Chrome
   - Visita: `https://tudominio.com`

2. **Toca el botón Compartir:**
   - Es el ícono de compartir (cuadrado con flecha hacia arriba) en la parte inferior
   - En iPad, está en la parte superior

3. **Selecciona "Añadir a pantalla de inicio":**
   - Desplázate hacia abajo en el menú
   - Busca la opción con el icono de "+"

4. **Confirma:**
   - Puedes cambiar el nombre si quieres
   - Toca "Añadir"

5. **¡Listo!** 🎉
   - El icono aparecerá en tu pantalla de inicio
   - Funciona sin conexión

---

### 💻 **Instalar en Computadora**

#### Windows/Mac (Chrome, Edge, Brave):

1. **Abre el sitio web:**
   - Visita: `https://tudominio.com`

2. **Busca el ícono de instalación:**
   - En la barra de direcciones, busca el ícono ⊕ (más)
   - O el botón "Instalar App" en la página

3. **Click en "Instalar":**
   - Se abrirá una ventana de confirmación
   - Click en "Instalar"

4. **¡Listo!** 🎉
   - La app se abrirá en su propia ventana
   - Aparecerá en tu menú de aplicaciones
   - Windows: Buscar → "Mapa de Puerres"
   - Mac: Launchpad → "Mapa de Puerres"

---

## 🛠️ Para Administradores (Subir al Hosting)

### **Requisitos Previos:**
- ✅ Hosting con soporte para archivos estáticos (cualquiera sirve)
- ✅ Dominio propio o subdominio
- ✅ **IMPORTANTE:** Certificado SSL/HTTPS activo (obligatorio para PWA)

---

### **Método 1: cPanel (Hosting tradicional)**

1. **Acceder a cPanel:**
   - Ingresa a tu panel de control
   - Usuario: `tu_usuario`
   - Contraseña: `tu_contraseña`

2. **Ir al Administrador de Archivos:**
   - Busca "Administrador de archivos" o "File Manager"
   - Click para abrir

3. **Navegar a la carpeta pública:**
   - Ve a `public_html` (o `www`, `htdocs` según tu hosting)
   - Si tienes un subdominio, ve a su carpeta específica

4. **Subir los archivos:**
   
   **Opción A - Subir carpeta comprimida (recomendado):**
   - En tu computadora, comprime toda la carpeta del proyecto
   - En cPanel, click en "Subir" o "Upload"
   - Selecciona el archivo ZIP
   - Espera a que se suba
   - Click derecho en el archivo → "Extraer" o "Extract"
   - Borra el archivo ZIP

   **Opción B - Subir archivos individuales:**
   - Sube todos los archivos y carpetas del proyecto
   - Mantén la estructura de carpetas intacta

5. **Verificar estructura:**
   ```
   public_html/
   ├── index.html
   ├── manifest.json
   ├── service-worker.js
   ├── css/
   ├── js/
   └── icons/
   ```

6. **Activar HTTPS (si no está activo):**
   - En cPanel, busca "SSL/TLS" o "Let's Encrypt"
   - Activa el certificado SSL gratuito
   - Espera 5-10 minutos a que se propague

7. **Probar:**
   - Visita: `https://tudominio.com`
   - Debe cargar sin errores
   - Abre DevTools (F12) → Console
   - No debe haber errores en rojo

---

### **Método 2: FTP/SFTP**

1. **Conectar con cliente FTP:**
   - Descarga FileZilla (gratis): https://filezilla-project.org
   - Abre FileZilla

2. **Configurar conexión:**
   - Host: `ftp.tudominio.com` o la IP de tu servidor
   - Usuario: tu usuario FTP
   - Contraseña: tu contraseña FTP
   - Puerto: 21 (FTP) o 22 (SFTP)

3. **Subir archivos:**
   - Panel izquierdo: tu computadora
   - Panel derecho: tu servidor
   - Navega a `public_html/` en el servidor
   - Arrastra toda la carpeta del proyecto desde tu computadora

4. **Verificar permisos:**
   - Todos los archivos: 644
   - Todas las carpetas: 755
   - (FileZilla lo hace automáticamente)

---

### **Método 3: Netlify (Gratis y Fácil) 🚀 RECOMENDADO**

1. **Crear cuenta:**
   - Ve a https://netlify.com
   - Regístrate gratis (con email o GitHub)

2. **Subir sitio:**
   - En el dashboard, arrastra la carpeta del proyecto
   - O click en "Add new site" → "Deploy manually"
   - Netlify lo procesará (30-60 segundos)

3. **Configurar dominio (opcional):**
   - Netlify te da un dominio gratis: `nombre-aleatorio.netlify.app`
   - Para usar tu dominio:
     - Click en "Domain settings"
     - "Add custom domain"
     - Sigue las instrucciones para configurar DNS

4. **¡Listo!** 🎉
   - Netlify incluye HTTPS automático (gratis)
   - CDN global (rápido en todo el mundo)
   - Despliegues instantáneos

---

### **Método 4: Vercel (Similar a Netlify)**

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Desplegar:**
   ```bash
   cd ruta/a/tu/proyecto
   vercel --prod
   ```

3. **Seguir instrucciones en pantalla**

---

### **Método 5: GitHub Pages (Gratis)**

1. **Crear repositorio en GitHub:**
   - Ve a https://github.com
   - Click en "New repository"
   - Nombre: `mapa-puerres`
   - Marca: "Public"
   - Click "Create repository"

2. **Subir archivos:**
   ```bash
   cd ruta/a/tu/proyecto
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/mapa-puerres.git
   git push -u origin main
   ```

3. **Activar GitHub Pages:**
   - Ve a Settings → Pages
   - Source: "Deploy from branch"
   - Branch: `main` → `/root`
   - Save

4. **Esperar 2-3 minutos:**
   - Tu sitio estará en: `https://tu-usuario.github.io/mapa-puerres`

---

## 🔍 Verificación Post-Instalación

### **1. Verificar que el sitio carga:**
- ✅ Visita `https://tudominio.com`
- ✅ La página debe cargar completamente
- ✅ El mapa debe ser visible

### **2. Verificar HTTPS:**
- ✅ La URL debe comenzar con `https://` (no `http://`)
- ✅ Debe haber un candado 🔒 en la barra de direcciones

### **3. Verificar Service Worker:**
- ✅ Abre DevTools (F12)
- ✅ Ve a Application → Service Workers
- ✅ Debe aparecer "activated and running"

### **4. Verificar Manifest:**
- ✅ En DevTools → Application → Manifest
- ✅ Debe mostrar el nombre, iconos, etc.

### **5. Test Lighthouse:**
- ✅ En DevTools → Lighthouse
- ✅ Run PWA audit
- ✅ Debe tener 90+ puntos

### **6. Probar instalación:**
- ✅ El botón "Instalar App" debe aparecer
- ✅ Al instalarlo, debe abrir como app independiente

### **7. Probar offline:**
- ✅ Visita el sitio con internet
- ✅ Desactiva WiFi/datos
- ✅ Recarga la página (F5)
- ✅ Debe funcionar sin internet

---

## ❌ Solución de Problemas Comunes

### **"No se puede instalar la app"**
- Verifica que tengas HTTPS activo
- Limpia caché del navegador
- Verifica que `manifest.json` sea accesible

### **"El Service Worker no se registra"**
- Revisa la consola (F12) para errores
- Verifica la ruta del `service-worker.js`
- Asegúrate de que esté en HTTPS

### **"El mapa no carga"**
- Verifica conexión a internet (primera vez)
- Revisa que Leaflet.js se cargue correctamente
- Abre la consola (F12) para ver errores

### **"Los iconos no aparecen"**
- Verifica que la carpeta `icons/` se subió correctamente
- Genera iconos PNG reales (ver README.md)
- Verifica permisos de archivos (644)

### **"No funciona en HTTP"**
- PWA **requiere HTTPS obligatoriamente**
- Activa SSL en tu hosting (gratis con Let's Encrypt)

---

## 📞 Soporte

**¿Necesitas ayuda?**
- 📧 Email: soporte@tudominio.com
- 💬 WhatsApp: +57 XXX XXX XXXX
- 🌐 Web: tudominio.com/soporte

---

**✅ Checklist Final:**

- [ ] Archivos subidos al servidor
- [ ] HTTPS activo y funcionando
- [ ] Sitio carga correctamente en navegador
- [ ] Service Worker registrado
- [ ] Botón de instalación aparece
- [ ] Se puede instalar en móvil
- [ ] Funciona offline después de primera visita
- [ ] Lighthouse PWA score > 90

---

🎉 **¡Felicidades! Tu PWA está lista para usarse.**


