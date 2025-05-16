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

# Start the application
Write-Host "Starting the application..."
Start-Process -FilePath "node" -ArgumentList "server.js" 