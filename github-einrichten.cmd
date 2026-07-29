@echo off
setlocal
title GitHub einrichten
cd /d "%~dp0"

set "GH=gh"
where gh >nul 2>&1 || set "GH=%ProgramFiles%\GitHub CLI\gh.exe"

echo.
echo ==========================================================
echo   Portfolio-Website auf GitHub veroeffentlichen
echo ==========================================================
echo.

rem --- 1. Anmeldung ---------------------------------------------------
"%GH%" auth status >nul 2>&1
if errorlevel 1 (
  echo   Schritt 1 von 3: Anmeldung bei GitHub
  echo.
  echo   Gleich oeffnet sich dein Browser. Melde dich dort an
  echo   und bestaetige den angezeigten Code.
  echo.
  pause
  "%GH%" auth login --hostname github.com --git-protocol https --web --scopes repo,workflow
  if errorlevel 1 goto fehler
) else (
  echo   Schritt 1 von 3: Bereits angemeldet.
)

rem --- 2. Repository anlegen und hochladen -----------------------------
echo.
echo   Schritt 2 von 3: Repository anlegen und hochladen
echo.
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  "%GH%" repo create Portfolio_Website_Marco_Strote --public --source=. --remote=origin --push --description "Portfolio-Website von Marco Strote"
  if errorlevel 1 goto fehler
) else (
  echo   Repository ist bereits verknuepft - lade Aenderungen hoch.
  git push -u origin main
  if errorlevel 1 goto fehler
)

rem --- 3. GitHub Pages aktivieren --------------------------------------
echo.
echo   Schritt 3 von 3: Veroeffentlichung aktivieren
echo.
for /f "delims=" %%o in ('"%GH%" repo view --json nameWithOwner -q .nameWithOwner') do set "REPO=%%o"
"%GH%" api -X POST "repos/%REPO%/pages" -f "build_type=workflow" >nul 2>&1
if errorlevel 1 "%GH%" api -X PUT "repos/%REPO%/pages" -f "build_type=workflow" >nul 2>&1

echo.
echo ==========================================================
echo   Fertig.
echo.
echo   Repository:  https://github.com/%REPO%
echo.
echo   Die Website wird jetzt automatisch gebaut. In ein bis
echo   zwei Minuten ist sie erreichbar. Die genaue Adresse
echo   steht auf github.com unter Settings - Pages.
echo ==========================================================
echo.
pause
goto ende

:fehler
echo.
echo   Es ist ein Fehler aufgetreten. Schick mir bitte die
echo   Meldung oben - dann kuemmere ich mich darum.
echo.
pause

:ende
endlocal
