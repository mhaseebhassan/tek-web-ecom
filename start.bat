@echo off
echo ==============================================================
echo                 TEKRON E-COMMERCE LAUNCHER
echo ==============================================================
echo.

echo [1/3] Starting Docker Compose (Kafka ^& Zookeeper)...
cd /d "%~dp0"
docker compose up -d

echo.
echo [2/3] Starting Backend Server...
cd /d "%~dp0\backend"
start "Tekron Backend" cmd /c "npm run dev"

echo.
echo [3/3] Starting Frontend Server...
cd /d "%~dp0\frontend"
start "Tekron Frontend" cmd /c "npm run dev"

echo.
echo ==============================================================
echo Tekron Stack is launching! 
echo.
echo Wait a few seconds for Next.js to compile.
echo Backend is running at:  http://localhost:5000
echo Frontend is running at: http://localhost:3000
echo ==============================================================
pause
