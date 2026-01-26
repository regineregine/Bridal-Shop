@echo off
echo Setting up zrok reservations for Bridal Shop ecommerce website...
echo.

echo Creating reservation for backend (Laravel API on localhost:8000)...
zrok reserve public http://localhost:8000 --backend-mode proxy --unique-name promisephbackend
echo.

echo Creating reservation for frontend (React app on localhost:5173)...
zrok reserve public http://localhost:5173 --backend-mode proxy --unique-name promiseph
echo.

echo Reservations created successfully!
echo.
echo To start the tunnels:
echo 1. Run start-zrok-backend.bat in one terminal
echo 2. Run start-zrok-frontend.bat in another terminal
echo.
echo Your site will be accessible at: https://promiseph.share.zrok.io
echo.
pause