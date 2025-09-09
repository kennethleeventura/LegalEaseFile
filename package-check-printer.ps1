# Create GitHub Repository for Check Printer
Write-Host "Setting up Check Printer GitHub Repository..." -ForegroundColor Green

# First, package the application
Write-Host "1. Packaging application..." -ForegroundColor Cyan
& .\package-check-printer.ps1

# Navigate to the packaged directory
Set-Location "check-printer-app"

Write-Host "2. Repository setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS - Do these manually:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name: check-printer-app" -ForegroundColor White
Write-Host "3. Description: GUI-based check printing software for business checks" -ForegroundColor White
Write-Host "4. Make it Public or Private (your choice)" -ForegroundColor White
Write-Host "5. Don't initialize with README (we already have one)" -ForegroundColor White
Write-Host "6. Click 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "THEN RUN THESE COMMANDS:" -ForegroundColor Cyan
Write-Host "git remote add origin https://github.com/YOUR_USERNAME/check-printer-app.git" -ForegroundColor White
Write-Host "git branch -M main" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Replace YOUR_USERNAME with your actual GitHub username" -ForegroundColor Yellow

Set-Location ..
