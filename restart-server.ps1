# Function to kill process on port 3001
function Kill-PortProcess {
    $port = 3001
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $pid = $process.OwningProcess
        Write-Host "Found process $pid using port $port"
        Stop-Process -Id $pid -Force
        Write-Host "Killed process $pid"
    } else {
        Write-Host "No process found using port $port"
    }
}

# Check network connectivity
Write-Host "Checking network connectivity..."
$networkCheck = Test-NetConnection -ComputerName localhost -Port 3001 -InformationLevel Detailed
Write-Host "Network check results:"
Write-Host "TcpTestSucceeded: $($networkCheck.TcpTestSucceeded)"
Write-Host "RemoteAddress: $($networkCheck.RemoteAddress)"
Write-Host "RemotePort: $($networkCheck.RemotePort)"

# Kill any existing process on port 3001
Kill-PortProcess

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

# Start the server
Write-Host "Starting server..."
Write-Host "Current directory: $(Get-Location)"
Write-Host "Node version: $(node -v)"
Write-Host "NPM version: $(npm -v)"

Start-Process -FilePath "node" -ArgumentList "server.js" 