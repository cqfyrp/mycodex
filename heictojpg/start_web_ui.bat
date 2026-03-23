@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "PYTHON_EXE=%SCRIPT_DIR%.venv\Scripts\python.exe"
set "PYTHON_CMD=%PYTHON_EXE%"

if not exist "%PYTHON_EXE%" (
    set "PYTHON_CMD=python"
)

set "SERVER_SCRIPT=%SCRIPT_DIR%web_ui_server.py"

if not exist "%SERVER_SCRIPT%" (
    echo Could not find "%SERVER_SCRIPT%".
    pause
    exit /b 1
)

start "HEIC to JPG Web UI" "%PYTHON_CMD%" "%SERVER_SCRIPT%"
powershell -NoProfile -Command "Start-Sleep -Seconds 2"
start "" "http://127.0.0.1:8765"
exit /b 0
