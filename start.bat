@echo off
echo Starting URL Shortener Application...
echo.
echo Make sure MongoDB is running!
echo.
echo Starting backend server...
start cmd /k "cd /d %~dp0 && npm run server"
echo.
echo Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak >nul
echo.
echo Starting frontend...
start cmd /k "cd /d %~dp0\client && npm start"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
