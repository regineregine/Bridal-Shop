@echo off
echo Starting zrok tunnel for backend (Laravel API on port 8000)...
echo Using unique name: promisephbackend
echo.
echo Backend will be accessible at: https://promisephbackend.share.zrok.io
echo (Frontend will proxy API calls to this domain)
echo.
echo Make sure your Laravel backend is running on localhost:8000
echo.
zrok share reserved promisephbackend
pause