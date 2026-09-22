# Start the whole lab in one window: the API and the interface together.
#
# Usage:  .\start.ps1
#         .\start.ps1 -Force    replace whatever is already on ports 3000/5500
#         powershell -ExecutionPolicy Bypass -File .\start.ps1   (if PowerShell blocks it)
# Stop:   Ctrl+C
#
# For auto-restart on save (node --watch), use npm start + npm run ui instead.

[CmdletBinding()]
param(
    [switch]$Force
)

Set-Location -LiteralPath $PSScriptRoot

$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) {
    Write-Host "error: Node.js is required but was not found on PATH."
    exit 1
}

# express is the only dependency; install it on a fresh clone.
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot "node_modules\express"))) {
    Write-Host "node_modules is missing - running npm install..."
    npm install
    if ($LASTEXITCODE -ne 0) { exit 1 }
}

function Get-PortOwner([int]$Port) {
    # Get-NetTCPConnection is absent on very old Windows - then skip the check.
    try {
        $listener = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction Stop
        return $listener[0].OwningProcess
    } catch {
        return $null
    }
}

# Check both ports first: node's raw EADDRINUSE stack trace is hard to read,
# and without this the cleanup would stop the server that did start.
foreach ($target in @(
        @{ Port = 3000; Label = "API" },
        @{ Port = 5500; Label = "UI" }
    )) {
    $ownerPid = Get-PortOwner $target.Port
    if (-not $ownerPid) { continue }

    $owner = Get-Process -Id $ownerPid -ErrorAction SilentlyContinue
    $ownerName = if ($owner) { $owner.ProcessName } else { "unknown process" }

    if (-not $Force) {
        Write-Host "error: port $($target.Port) ($($target.Label)) is already in use by $ownerName (PID $ownerPid)."
        Write-Host "       Stop it first, or re-run with -Force to replace it:"
        Write-Host "         Stop-Process -Id $ownerPid"
        exit 1
    }

    Write-Host "Stopping $ownerName (PID $ownerPid) on port $($target.Port) (-Force)..."
    Stop-Process -Id $ownerPid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500

    if (Get-PortOwner $target.Port) {
        Write-Host "error: port $($target.Port) is still in use after stopping PID $ownerPid."
        exit 1
    }
}

$api = $null
$ui = $null

function Stop-Both {
    foreach ($proc in @($api, $ui)) {
        if ($null -ne $proc -and -not $proc.HasExited) {
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

try {
    Write-Host "API  http://localhost:3000"
    Write-Host "UI   http://localhost:5500"
    Write-Host "Press Ctrl+C to stop both."
    Write-Host ""

    $api = Start-Process -FilePath $node -ArgumentList "server.js" -WorkingDirectory $PSScriptRoot -NoNewWindow -PassThru
    $ui = Start-Process -FilePath $node -ArgumentList "serve-ui.js" -WorkingDirectory $PSScriptRoot -NoNewWindow -PassThru

    # Stop both as soon as either one exits.
    while (-not $api.HasExited -and -not $ui.HasExited) {
        Start-Sleep -Milliseconds 500
    }

    if ($api.HasExited) { Write-Host "API (server.js) stopped." }
    if ($ui.HasExited) { Write-Host "UI (serve-ui.js) stopped." }
}
finally {
    Write-Host ""
    Write-Host "Stopping..."
    Stop-Both
}
