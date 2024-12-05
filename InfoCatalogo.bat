@echo off

:: Verificar si el servidor ya está en ejecución
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I "node.exe">NUL
if %errorlevel% NEQ 0 (
    :: Si no está en ejecución, iniciar el servidor Node.js en una ventana de terminal
    start "" cmd /C "node server.js"
)

:: Esperar un momento para asegurarse de que el servidor ha arrancado-Cambiar a 5 funciona mal
timeout /t 1 /nobreak >nul

:: Abre Chrome con el localhost
start "" chrome http://localhost:3000

:: Esperar a que Chrome esté cerrado antes de finalizar el script-Cambiar a 10 si funciona mal
timeout /t 40 /nobreak >nul

:: Terminar el proceso del servidor Node.js al cerrar el navegador
taskkill /IM node.exe /F
