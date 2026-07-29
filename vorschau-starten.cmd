@echo off
title Portfolio-Vorschau - dieses Fenster offen lassen
cd /d "%~dp0"

echo.
echo   Website wird gebaut...
echo.
node src\build.js
if errorlevel 1 goto fehler

echo.
echo   ------------------------------------------------
echo    Vorschau laeuft:  http://localhost:4173
echo    Beenden: dieses Fenster schliessen
echo   ------------------------------------------------
echo.

start "" http://localhost:4173
node src\serve.js
goto ende

:fehler
echo.
echo   Es ist ein Fehler aufgetreten. Ist Node.js installiert?
echo   Download: https://nodejs.org
echo.
pause

:ende
