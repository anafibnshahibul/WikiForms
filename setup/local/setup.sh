@echo off
SETLOCAL EnableDelayedExpansion

echo ===================================
echo Setting up WikiForms...
echo ===================================

:: Check if directory already exists, otherwise clone
IF NOT EXIST "WikiForms" (
    echo Cloning repository...
    git clone https://github.com/anafibnshahibul/WikiForms.git
    cd WikiForms
) ELSE (
    IF EXIST "backend\.env.example" (
        echo Already inside WikiForms or directory exists. Continuing...
    ) ELSE (
        cd WikiForms
    )
)

:: Copy .env file if it doesn't exist
IF NOT EXIST "backend\.env" (
    echo Creating backend\.env from .env.example...
    copy backend\.env.example backend\.env
    echo.
    echo [ACTION REQUIRED] Please edit backend\.env to add your MediaWiki OAuth keys and OpenRouter key!
    echo Pause execution... Press any key after updating backend\.env.
    pause
) ELSE (
    echo backend\.env already exists. Skipping copy.
)

:: Start Docker Compose
echo Starting Docker containers...
docker compose up -d --build

echo ===================================
echo Setup Complete!
echo Open http://localhost:8080 in your browser.
echo ===================================
pause