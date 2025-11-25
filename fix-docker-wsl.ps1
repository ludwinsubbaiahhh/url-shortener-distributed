# Script to fix Docker Desktop WSL Integration issues

Write-Host "Stopping all WSL distributions..." -ForegroundColor Yellow
wsl --shutdown

Write-Host "Waiting 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Starting Ubuntu-24.04..." -ForegroundColor Yellow
wsl --distribution Ubuntu-24.04 --exec echo "Ubuntu-24.04 started"

Write-Host "`nWSL Status:" -ForegroundColor Green
wsl --list --verbose

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Open Docker Desktop" -ForegroundColor White
Write-Host "2. Go to Settings > Resources > WSL Integration" -ForegroundColor White
Write-Host "3. Enable Ubuntu-24.04 integration" -ForegroundColor White
Write-Host "4. Click 'Apply & Restart'" -ForegroundColor White

