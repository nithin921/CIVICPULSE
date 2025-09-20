@echo off
echo Starting Civic Pulse PWA...
echo.

echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server...
start "Civic Pulse API" cmd /k "npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting frontend application...
cd ..
start "Civic Pulse Frontend" cmd /k "npm start"

echo.
echo Civic Pulse PWA is starting...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Both applications will open in separate windows.
echo Press any key to exit this script...
pause >nul
