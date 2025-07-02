@echo off
REM Read project directory from config.txt
set /p PROJECT_DIR=<config.txt

REM Debug output to check the path being used
echo Configured Project Directory: "%PROJECT_DIR%"

REM Change to the project directory
cd /d "%PROJECT_DIR%" || (
    echo ERROR: Could not change directory to "%PROJECT_DIR%".
    pause
    exit /b
)

REM Check if node_modules folder exists; install dependencies if missing
if not exist "src\node_modules" (
    echo Installing dependencies...
    npm install --prefix src || (
        echo ERROR: npm install failed. Please check your Node.js setup.
        pause
        exit /b
    )
) else (
    echo Dependencies are already installed.
)

REM Start the server in the same window using 'start /b' to avoid opening a new one
echo Starting vstate-utils API server...
start /b node src/index.js || (
    echo ERROR: Failed to start the server. Check for errors in src/index.js.
    pause
    exit /b
)

REM Keep the console open after the server sto

pause