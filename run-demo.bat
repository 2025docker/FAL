@echo off
title FAL - Finance & Asset Ledger (Demo)
echo.
echo ========================================
echo   FAL - Finance ^& Asset Ledger
echo   Running in Demo Mode (localStorage)
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules\" (
  echo Installing dependencies...
  echo.
  call npm install
  echo.
)

echo Starting dev server...
echo.
echo Open http://localhost:3000 in your browser
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
