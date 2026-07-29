@echo off
setlocal
title Aenderungen hochladen
cd /d "%~dp0"

set "GH=gh"
where gh >nul 2>&1 || set "GH=%ProgramFiles%\GitHub CLI\gh.exe"

echo.
echo   Website und Lebenslauf werden neu erzeugt...
echo.
node src\build.js
if errorlevel 1 goto fehler
node src\make-cv.js
if errorlevel 1 goto fehler

echo.
git add -A
git diff --cached --quiet
if not errorlevel 1 (
  echo   Keine Aenderungen vorhanden - es gibt nichts hochzuladen.
  echo.
  pause
  goto ende
)

for /f "tokens=1-3 delims=. " %%a in ("%date%") do set "HEUTE=%%a.%%b.%%c"
git commit -q -m "Inhalte aktualisiert (%HEUTE%)"
if errorlevel 1 goto fehler

echo   Wird hochgeladen...
git push origin main
if errorlevel 1 goto fehler

echo.
echo   ------------------------------------------------
echo    Fertig. Die Seite wird jetzt automatisch neu
echo    veroeffentlicht - das dauert ein bis zwei Minuten.
echo   ------------------------------------------------
echo.
pause
goto ende

:fehler
echo.
echo   Es ist ein Fehler aufgetreten. Schick mir bitte die
echo   Meldung oben, dann kuemmere ich mich darum.
echo.
pause

:ende
endlocal
