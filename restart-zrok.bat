@echo off
echo Restarting all zrok tunnels...
echo.
echo This will stop any existing tunnels and restart them properly.
echo Make sure your local servers are running first!
echo.

echo Stopping existing tunnels (if any)...
zrok share reserved promisephfrontend --headless >nul 2>&1
zrok share reserved promisephbackend --headless >nul 2>&1
timeout /t 2 /nobreak >nul

echo Starting backend tunnel...
start cmd /c "start-zrok-backend.bat"

echo Starting frontend tunnel...
start cmd /c "start-zrok-frontend.bat"

echo.
echo Tunnels are starting in new windows.
echo Access your site at: https://promisephfrontend.share.zrok.io
echo.
pause