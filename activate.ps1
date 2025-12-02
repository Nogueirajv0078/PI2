# ============================
# Project Activation Script
# ============================

Clear-Host

Write-Host "=== Project Activation Script ==="

# ----------------------------
# Paths
# ----------------------------
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "Backend"
# Frontend folder name contains spaces in this repo
# Try to locate the frontend folder automatically to avoid encoding issues with accented names
$frontendPath = $null
try {
    $found = Get-ChildItem -Path $projectRoot -Directory | Where-Object { $_.Name -like '*Interface*' -or $_.Name -like '*Relat*' } | Select-Object -First 1
    if ($found) {
        $frontendPath = $found.FullName
    } else {
        # Fallback to the known folder name (may fail if encoding causes issues)
        $frontendPath = Join-Path $projectRoot "Relatório com Interface Intuitiva"
    }
} catch {
    # If directory enumeration fails for any reason, fallback to expected name
    $frontendPath = Join-Path $projectRoot "Relatório com Interface Intuitiva"
}
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
        Set-Location -LiteralPath $frontendPath
        npm install
    }
}

function Start-Backend {
    Write-Host "Starting backend..."
    $cmd = "Set-Location -LiteralPath '$backendPath'; & '$venvPython' manage.py runserver"
    Start-Process powershell -ArgumentList '-NoExit', '-Command', $cmd
}

function Start-Frontend {
    Write-Host "Starting frontend..."
    # Determine available npm script (prefer start -> dev -> serve)
    $packageJsonPath = Join-Path $frontendPath 'package.json'
    $startCmd = 'npm run dev'
    if (Test-Path $packageJsonPath) {
        try {
            $pkg = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json
            if ($pkg.scripts -and $pkg.scripts.start) {
                $startCmd = 'npm start'
            } elseif ($pkg.scripts -and $pkg.scripts.dev) {
                $startCmd = 'npm run dev'
            } elseif ($pkg.scripts -and $pkg.scripts.serve) {
                $startCmd = 'npm run serve'
            }
        } catch {
            # fallback to npm run dev if package.json cannot be parsed
            $startCmd = 'npm run dev'
        }
    }

    $cmd = "Set-Location -LiteralPath '$frontendPath'; $startCmd"
    Start-Process powershell -ArgumentList '-NoExit', '-Command', $cmd
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
