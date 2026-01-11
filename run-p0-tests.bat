



@echo off
title Pruebas Automatizadas P0 - Ahorro Digital
color 0A

echo ============================================
echo   EJECUTANDO PRUEBAS P0 CON NEWMAN
echo   Servidor: http://localhost:3001
echo ============================================
echo.

echo 1. Verificando servidor...
curl http://localhost:3001/api/v1/health > nul 2>&1
if errorlevel 1 echo ❌ ERROR: Servidor no responde && echo    Ejecuta primero: node MockServer\server.js && pause && goto :error_handled
echo ✅ Servidor funcionando
echo.

echo 2. Ejecutando 3 pruebas P0...
echo    - P0-1: Calculo exitoso
echo    - P0-2: Campo faltante
echo    - P0-3: Producto no existe
echo.

newman run Testing_api\colections\P0-EndpointsCriticos.postman_collection.json -e Testing_api\environments\P0-EndpointsCriticos.postman_environment.json   -r cli,html   --reporter-html-export Reports\p0-report.html

if errorlevel 1 (
    echo ❌ Algunas pruebas fallaron
) else (
    echo ✅ Todas las pruebas pasaron
)

echo.
echo 3. Reporte generado en: Reports\p0-report.html
echo    Para abrir: start Reports\p0-report.html
echo.
echo ============================================
pause