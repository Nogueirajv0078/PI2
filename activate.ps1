# ============================
# Project Activation Script
# ============================

Clear-Host

Write-Host "=== Project Activation Script ==="

# ----------------------------
# Paths
# ----------------------------
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"
$venvPath = Join-Path $backendPath "venv"
$venvPython = Join-Path $venvPath "Scripts\python.exe"

# ----------------------------
# Functions
# ----------------------------

function Check-Python {
    Write-Host "Checking Python installation..."
    $pythonVersion = python --version 2>$null
    if (!$pythonVersion) {
        Write-Host "Python was not found. Install Python 3.10+ and try again."
        exit
    }
    Write-Host "Python OK: $pythonVersion"
}

function Check-Node {
    Write-Host "Checking Node installation..."
    $nodeVersion = node --version 2>$null
    if (!$nodeVersion) {
        Write-Host "Node.js was not found. Install Node.js LTS and try again."
        exit
    }
    Write-Host "Node.js OK: $nodeVersion"
}

function Create-Venv {
    if (!(Test-Path $venvPath)) {
        Write-Host "Creating Python virtual environment..."
        python -m venv $venvPath
    }
}

function Install-Backend-Requirements {
    if (Test-Path "$backendPath\requirements.txt") {
        Write-Host "Installing backend dependencies..."
        & $venvPython -m pip install --upgrade pip
        & $venvPython -m pip install -r "$backendPath\requirements.txt"
    }
}

function Install-Frontend-Dependencies {
    if (Test-Path "$frontendPath\package.json") {
        Write-Host "Installing frontend dependencies..."
        Set-Location $frontendPath
        npm install
    }
}

function Start-Backend {
    Write-Host "Starting backend..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$backendPath`"; & `"$venvPython`" manage.py runserver"
}

function Start-Frontend {
    Write-Host "Starting frontend..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$frontendPath`"; npm start"
}

# ----------------------------
# MAIN MENU
# ----------------------------

function Main-Menu {
    while ($true) {
        Clear-Host
        Write-Host "=== Project Control Menu ==="
        Write-Host ""
        Write-Host "1) Start Backend"
        Write-Host "2) Start Frontend"
        Write-Host "3) Start Both"
        Write-Host "4) Install all dependencies"
        Write-Host "5) Exit"
        Write-Host ""

        $choice = Read-Host "Choose an option"

        switch ($choice) {
            "1" { Start-Backend; Read-Host "Press ENTER to return to menu" }
            "2" { Start-Frontend; Read-Host "Press ENTER to return to menu" }
            "3" { Start-Backend; Start-Frontend; Read-Host "Press ENTER to return to menu" }
            "4" {
                Check-Python
                Check-Node
                Create-Venv
                Install-Backend-Requirements
                Install-Frontend-Dependencies
                Read-Host "Dependencies installed. Press ENTER to return to menu"
            }
            "5" { return }
            default {
                Write-Host "Invalid option. Try again."
                Start-Sleep -Seconds 1
            }
        }
    }
}

# ----------------------------
# Start Script
# ----------------------------
Main-Menu
