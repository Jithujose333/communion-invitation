@echo off
echo Starting Felix & Festin's Communion Invitation Dev Server...
node node_modules\concurrently\dist\bin\concurrently.js "node backend/server.js" "node frontend/node_modules/vite/bin/vite.js frontend"
pause
