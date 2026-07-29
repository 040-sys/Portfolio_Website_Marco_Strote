@echo off
title Website aktualisieren
cd /d "%~dp0"

echo.
echo   Website wird neu gebaut...
echo.
node src\build.js
if errorlevel 1 goto fehler

echo.
echo   Fertig. Zum Ansehen: vorschau-starten.cmd
echo.
pause
goto ende

:fehler
echo.
echo   Es ist ein Fehler aufgetreten.
echo   Haeufigste Ursache: In content\de.json fehlt ein Komma
echo   oder ein Anfuehrungszeichen.
echo.
pause

:ende
