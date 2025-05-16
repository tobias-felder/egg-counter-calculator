# Set environment variables from .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1]
            $value = $matches[2]
            Set-Item -Path "env:$name" -Value $value
        }
    }
}

# Show the environment variables (without sensitive values)
Write-Host "Environment variables loaded from .env file"
Write-Host "PORT: $env:PORT"

# Check if port 3000 is in use
$portInUse = netstat -ano | findstr :3000
if ($portInUse) {
    Write-Host "Port 3000 is already in use. Attempting to free it..."
    $processId = ($portInUse -split '\s+')[-1]
    taskkill /F /PID $processId
    Write-Host "Killed process $processId"
}

# Start the server
Write-Host "Starting the server..."
Start-Process -FilePath "node" -ArgumentList "server.js" 