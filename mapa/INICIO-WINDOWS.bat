@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════════════════════════════
echo.
echo                    🗺️  MAPA DE PUERRES - PWA
echo.
echo ═══════════════════════════════════════════════════════════════════════
echo.
echo  Iniciando servidor de desarrollo...
echo.
echo  📡 URL: http://localhost:8000
echo.
echo  ⚠️  NOTA: Para PWA completa necesitas HTTPS
echo     Este servidor es solo para desarrollo local
echo.
echo  🛑 Para detener: Ctrl+C
echo.
echo ═══════════════════════════════════════════════════════════════════════
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python no está instalado
    echo.
    echo Por favor, instala Python desde:
    echo https://www.python.org/downloads/
    echo.
    echo Asegúrate de marcar "Add Python to PATH" durante la instalación.
    echo.
    pause
    exit /b 1
)

echo ✅ Python detectado
echo.
echo 🚀 Iniciando servidor...
echo.
echo 🌐 El navegador se abrirá automáticamente...
echo.

REM Iniciar servidor y abrir navegador
start http://localhost:8000
python -m http.server 8000

pause


