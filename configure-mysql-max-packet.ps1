# PowerShell script to set MySQL max_allowed_packet permanently

Write-Host "MySQL max_allowed_packet Configuration Helper" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Find MySQL config file
$configLocations = @(
    "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini",
    "C:\ProgramData\MySQL\MySQL Server 5.7\my.ini",
    "C:\Program Files\MySQL\MySQL Server 8.0\my.ini",
    "C:\Program Files\MySQL\MySQL Server 5.7\my.ini"
)

$configFile = $null
foreach ($location in $configLocations) {
    if (Test-Path $location) {
        $configFile = $location
        break
    }
}

if ($configFile) {
    Write-Host "Found MySQL config file: $configFile" -ForegroundColor Green
    Write-Host ""
    
    # Read current content
    $content = Get-Content $configFile -Raw
    
    # Check if max_allowed_packet already exists
    if ($content -match 'max_allowed_packet') {
        Write-Host "max_allowed_packet is already configured in the config file" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Current relevant lines:" -ForegroundColor Yellow
        Get-Content $configFile | Select-String "max_allowed_packet"
        Write-Host ""
        Write-Host "To update it, edit the line to:" -ForegroundColor Cyan
        Write-Host "  max_allowed_packet = 256M" -ForegroundColor Green
    } else {
        Write-Host "max_allowed_packet not found in config file" -ForegroundColor Yellow
        Write-Host ""
        
        # Try to add it to [mysqld] section
        if ($content -match '\[mysqld\]') {
            $newContent = $content -replace '(\[mysqld\])', "`$1`nmax_allowed_packet = 256M"
            
            Write-Host "Adding max_allowed_packet = 256M to config file..." -ForegroundColor Cyan
            Set-Content $configFile -Value $newContent -Force
            Write-Host "✓ Successfully added to config file!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Now restart MySQL service:" -ForegroundColor Cyan
            Write-Host "  net stop MySQL80" -ForegroundColor Yellow
            Write-Host "  net start MySQL80" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Or use Services.msc and restart 'MySQL80' service" -ForegroundColor Gray
        } else {
            Write-Host "ERROR: Could not find [mysqld] section in config file" -ForegroundColor Red
            Write-Host "Please manually edit: $configFile" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "ERROR: MySQL config file not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common locations:" -ForegroundColor Yellow
    $configLocations | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    Write-Host "Please manually create/edit your MySQL config file and add:" -ForegroundColor Cyan
    Write-Host "  [mysqld]" -ForegroundColor Green
    Write-Host "  max_allowed_packet = 256M" -ForegroundColor Green
}

Write-Host ""
Write-Host "For more help, see: https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_max_allowed_packet" -ForegroundColor Gray
