# Package Check Printing Software for GitHub
Write-Host "Creating check printer deployment package..." -ForegroundColor Green

# Create deployment directory
$deployDir = "check-printer-app"
New-Item -ItemType Directory -Path $deployDir -Force | Out-Null

# Copy Python application files
Copy-Item -Path "*.py" -Destination $deployDir
Copy-Item -Path "requirements.txt" -Destination $deployDir -ErrorAction SilentlyContinue
Copy-Item -Path "README.md" -Destination $deployDir -ErrorAction SilentlyContinue

# Copy directories if they exist
if (Test-Path "templates") { Copy-Item -Path "templates" -Destination $deployDir -Recurse }
if (Test-Path "static") { Copy-Item -Path "static" -Destination $deployDir -Recurse }
if (Test-Path "data") { Copy-Item -Path "data" -Destination $deployDir -Recurse }
if (Test-Path "config") { Copy-Item -Path "config" -Destination $deployDir -Recurse }

# Create setup instructions
@"
# Check Printing Software

A GUI-based check printing application for standard business checks.

## Features
- Print standard business checks
- Customer and vendor management
- Check register tracking
- MICR encoding support
- Print preview

## Setup
```bash
pip install -r requirements.txt
python main.py
```

## Requirements
- Python 3.8+
- tkinter (usually included with Python)
- reportlab for PDF generation
- Additional dependencies in requirements.txt
"@ | Out-File -FilePath "$deployDir\README.md"

# Create requirements.txt if it doesn't exist
if (-not (Test-Path "requirements.txt")) {
@"
tkinter
reportlab
pillow
datetime
sqlite3
"@ | Out-File -FilePath "$deployDir\requirements.txt"
}

# Initialize git repository and commit
Set-Location $deployDir
git init
git add .
git commit -m "Initial commit: Check printing software"

Write-Host "Package created in: $deployDir" -ForegroundColor Green
Write-Host "Ready to push to GitHub repository!" -ForegroundColor Yellow
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create repository on GitHub" -ForegroundColor White
Write-Host "2. git remote add origin https://github.com/yourusername/check-printer.git" -ForegroundColor White
Write-Host "3. git push -u origin main" -ForegroundColor White

Set-Location ..
