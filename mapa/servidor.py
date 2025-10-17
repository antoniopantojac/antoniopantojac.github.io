#!/usr/bin/env python3
"""
Servidor HTTP simple para probar la PWA localmente.
Ejecutar: python servidor.py
Luego abrir: http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler personalizado con MIME types correctos para PWA"""
    
    def end_headers(self):
        # Habilitar CORS para desarrollo
        self.send_header('Access-Control-Allow-Origin', '*')
        # Cache control para Service Worker
        if self.path.endswith('.js') or self.path.endswith('.json'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    extensions_map = {
        '.manifest': 'application/manifest+json',
        '.json': 'application/json',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '': 'application/octet-stream',
    }

def main():
    # Cambiar al directorio del script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"""
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🗺️  MAPA DE PUERRES - PWA                        ║
║                                                            ║
║  Servidor de desarrollo iniciado                          ║
║                                                            ║
║  📡 URL: http://localhost:{PORT}                          ║
║                                                            ║
║  ⚠️  NOTA: Para funcionalidad completa de PWA             ║
║     (instalación, service worker), necesitas HTTPS.       ║
║     Usa ngrok o sube a un hosting con SSL.                ║
║                                                            ║
║  🛑 Para detener: Ctrl+C                                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    """)
    
    # Crear servidor
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"✅ Sirviendo en puerto {PORT}...")
        print(f"🌐 Abriendo navegador...\n")
        
        # Abrir en navegador automáticamente
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Servidor detenido.")
            print("👋 ¡Hasta luego!\n")

if __name__ == "__main__":
    main()


