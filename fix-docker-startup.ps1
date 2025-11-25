# Comprehensive Docker Desktop Startup Fix Script
# Run this script as Administrator if Docker Desktop still won't start

Write-Host "=== Docker Desktop Startup Fix ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Shutdown WSL completely
Write-Host "[1/6] Shutting down WSL..." -ForegroundColor Yellow
wsl --shutdown
Start-Sleep -Seconds 3

# Step 2: Stop all Docker processes
Write-Host "[2/6] Stopping Docker Desktop processes..." -ForegroundColor Yellow
$dockerProcesses = @("Docker Desktop", "com.docker.backend", "dockerd", "vpnkit")
foreach ($proc in $dockerProcesses) {
    Get-Process -Name $proc -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2

# Step 3: Check WSL status
Write-Host "[3/6] Checking WSL status..." -ForegroundColor Yellow
wsl --status
Write-Host ""

# Step 4: Start WSL distributions
Write-Host "[4/6] Starting WSL distributions..." -ForegroundColor Yellow
wsl --distribution docker-desktop --exec echo "Docker Desktop WSL started" 2>$null
wsl --distribution Ubuntu-24.04 --exec echo "Ubuntu-24.04 started" 2>$null
Start-Sleep -Seconds 2

# Step 5: Show WSL status
Write-Host "[5/6] Current WSL status:" -ForegroundColor Yellow
wsl --list --verbose
Write-Host ""

# Step 6: Start Docker Desktop
Write-Host "[6/6] Starting Docker Desktop..." -ForegroundColor Yellow
$dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerPath) {
    Start-Process $dockerPath
    Write-Host "Docker Desktop is starting..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Please wait 30-60 seconds for Docker Desktop to fully initialize." -ForegroundColor Cyan
    Write-Host "You can check if it's ready by running: docker ps" -ForegroundColor Cyan
} else {
    Write-Host "ERROR: Docker Desktop not found at: $dockerPath" -ForegroundColor Red
    Write-Host "Please check your Docker Desktop installation." -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Wait for Docker Desktop to fully start (check system tray)" -ForegroundColor White
Write-Host "2. Open Docker Desktop Settings" -ForegroundColor White
Write-Host "3. Go to Resources > WSL Integration" -ForegroundColor White
Write-Host "4. Enable Ubuntu-24.04 integration" -ForegroundColor White
Write-Host "5. Click 'Apply & Restart'" -ForegroundColor White

