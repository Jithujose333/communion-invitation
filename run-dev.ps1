Write-Host "Starting Felix & Festin's Communion Invitation Dev Server..." -ForegroundColor Yellow
node node_modules/concurrently/dist/bin/concurrently.js "node backend/server.js" "node frontend/node_modules/vite/bin/vite.js frontend"
