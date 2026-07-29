@echo off
title Lebenslauf neu erstellen
cd /d "%~dp0"

echo.
echo   Website und Lebenslauf werden neu erzeugt...
echo.
node src\build.js
if errorlevel 1 goto fehler

echo.
node src\make-cv.js
if errorlevel 1 goto fehler

echo.
echo   Fertig. Die PDF liegt in:  assets\files\
echo.
pause
goto ende

:fehler
echo.
echo   Es ist ein Fehler aufgetreten.
echo   Haeufigste Ursachen:
echo     - In content\de.json fehlt ein Komma oder Anfuehrungszeichen
echo     - Die Pakete fehlen: einmalig "npm install" ausfuehren
echo.
pause

:ende
