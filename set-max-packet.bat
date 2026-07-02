@echo off
REM Script to set MySQL max_allowed_packet to 256MB
REM This sets it for the current session

echo Setting MySQL max_allowed_packet to 256MB...

REM Check if mysql command is available
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: mysql command not found in PATH
    echo Please ensure MySQL is installed and in your system PATH
    echo Alternatively, run this SQL command manually:
    echo.
    echo SET GLOBAL max_allowed_packet = 268435456;
    echo.
    pause
    exit /b 1
)

REM Set max_allowed_packet globally
mysql -u root -e "SET GLOBAL max_allowed_packet = 268435456; SHOW VARIABLES LIKE 'max_allowed_packet';"

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! max_allowed_packet has been set to 256MB
    echo NOTE: This setting will reset when MySQL restarts unless you update the config file.
    echo.
    echo To make it permanent, add this line to your MySQL config file:
    echo.
    echo   max_allowed_packet = 256M
    echo.
    echo Config file locations:
    echo   Windows: C:\ProgramData\MySQL\MySQL Server 8.0\my.ini
    echo   Linux: /etc/mysql/my.cnf
    echo   Mac: /usr/local/etc/my.cnf
    echo.
) else (
    echo ERROR: Could not set max_allowed_packet
    echo Please try running this command manually in MySQL:
    echo.
    echo SET GLOBAL max_allowed_packet = 268435456;
    echo.
)

pause
