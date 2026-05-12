@echo off
echo =======================================================
echo     Starting SIPCOT Analytics System
echo =======================================================
echo.

echo [1/2] Installing dependencies and starting Backend Server...
cd server
start cmd /k "title Backend Server && echo Installing backend dependencies... && npm install && echo Starting backend... && node index.js"
cd ..

echo [2/2] Installing dependencies and starting Frontend Server...
cd client
start cmd /k "title Frontend Server && echo Installing frontend dependencies... && npm install && echo Starting frontend... && npm run dev"
cd ..

echo.
echo Both servers are starting up in new windows.
echo Please wait about 15-30 seconds for the installations to finish.
echo Once Vite says "ready in ... ms", you can access the website.
echo.
echo Opening browser to http://localhost:5173...
timeout /t 10 /nobreak
start http://localhost:5173

echo.
pause
