# Create Check Printing Software - Complete Setup Script

Write-Host "Creating Check Printing Software..." -ForegroundColor Green

# Create directory structure
New-Item -ItemType Directory -Path "src", "src\models", "src\gui", "src\printing", "config" -Force | Out-Null

# Create README.md
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
``````bash
pip install -r requirements.txt
python main.py