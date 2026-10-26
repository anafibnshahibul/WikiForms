#!/usr/bin/env fish

echo "==================================="
echo "Setting up WikiForms..."
echo "==================================="

# Check if repo exists or if we are already inside it
if not test -d "WikiForms"; and not test -f "backend/.env.example"
    echo "Cloning repository..."
    git clone https://github.com/anafibnshahibul/WikiForms.git
    cd WikiForms
else if test -d "WikiForms"
    cd WikiForms
end

# Copy .env file
if not test -f "backend/.env"
    echo "Creating backend/.env from .env.example..."
    cp backend/.env.example backend/.env
    echo ""
    echo "------------------------------------------------------------------"
    echo "[ACTION REQUIRED] Edit backend/.env to add MediaWiki OAuth keys & OpenRouter key."
    echo "------------------------------------------------------------------"
    read -P "Press [Enter] after you have edited backend/.env to continue... "
else
    echo "backend/.env already exists. Skipping copy."
end

# Start Docker
echo "Starting Docker containers..."
docker compose up -d --build

echo "==================================="
echo "Setup Complete!"
echo "Open http://localhost:8080 in your browser."
echo "==================================="