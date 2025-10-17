# Script para limpiar completamente todos los cachés
Write-Host "🧹 Limpiando todos los cachés..." -ForegroundColor Yellow

# Limpiar caché del navegador (Chrome/Edge)
$chromeCachePath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"
$edgeCachePath = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"

if (Test-Path $chromeCachePath) {
    Write-Host "🗑️ Limpiando caché de Chrome..." -ForegroundColor Red
    Remove-Item "$chromeCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
}

if (Test-Path $edgeCachePath) {
    Write-Host "🗑️ Limpiando caché de Edge..." -ForegroundColor Red
    Remove-Item "$edgeCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
}

# Limpiar Service Worker registrations
Write-Host "⚙️ Limpiando registros de Service Worker..." -ForegroundColor Red

# Limpiar caché de aplicaciones web
$webCachePath = "$env:LOCALAPPDATA\Microsoft\Windows\INetCache"
if (Test-Path $webCachePath) {
    Write-Host "🌐 Limpiando caché web general..." -ForegroundColor Red
    Remove-Item "$webCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "✅ Limpieza completada!" -ForegroundColor Green
Write-Host "💡 Ahora abre el navegador en modo incógnito para probar" -ForegroundColor Cyan

# Pausar para que el usuario pueda leer
Read-Host "Presiona Enter para continuar"
