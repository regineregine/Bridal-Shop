@echo off
echo Starting zrok tunnel for frontend (React app on port 5173)...
echo Using unique name: promiseph
echo.
echo Access your frontend at: https://promiseph.share.zrok.io
echo.
echo Make sure your frontend dev server is running on localhost:5173
echo.
zrok share reserved promiseph
pause