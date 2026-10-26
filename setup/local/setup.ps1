# setup.ps1 (Windows PowerShell)
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Setting up WikiForms..." -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

if (!(Test-Path "WikiForms")) {
    Write-Host "Cloning repository..."
    git clone https://github.com/anafibnshahibul/WikiForms.git
    cd WikiForms
} else {
    cd WikiForms
}

if (!(Test-Path "backend\.env")) {
    Write-Host "Creating backend\.env from .env.example..."
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "`n[ACTION REQUIRED] Please edit backend\.env to add your MediaWiki OAuth keys and OpenRouter key!" -ForegroundColor Yellow
    Read-Host -Prompt "Press Enter after updating backend\.env to continue"
} else {
    Write-Host "backend\.env already exists. Skipping copy."
}

Write-Host "Starting Docker containers..."
docker compose up -d --build

Write-Host "===================================" -ForegroundColor Green
Write-Host "Setup Complete! Open http://localhost:8080" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green