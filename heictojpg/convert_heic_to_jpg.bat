@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "PYTHON_EXE=%SCRIPT_DIR%.venv\Scripts\python.exe"
set "PYTHON_CMD=%PYTHON_EXE%"

if not exist "%PYTHON_EXE%" (
    set "PYTHON_CMD=python"
)

set "SCRIPT_PATH=%SCRIPT_DIR%convert_heic_to_jpg.py"

if not exist "%SCRIPT_PATH%" (
    echo Could not find "%SCRIPT_PATH%".
    pause
    exit /b 1
)

if "%~1"=="" goto PROMPT
if /I "%~1"=="--help" goto HELP
if /I "%~1"=="-h" goto HELP

set "RECURSIVE="
if /I "%~1"=="/r" (
    set "RECURSIVE=-r"
    shift
)

if "%~1"=="" goto PROMPT

set "FAILED=0"

for %%I in (%*) do (
    echo Converting: %%~fI
    "%PYTHON_CMD%" "%SCRIPT_PATH%" "%%~fI" %RECURSIVE%
    if errorlevel 1 set "FAILED=1"
)

echo.
if "%FAILED%"=="0" (
    echo All done.
) else (
    echo Finished with errors.
)
pause
exit /b %FAILED%

:PROMPT
echo Enter a HEIC file path or a folder path.
set /p "INPUT_PATH=> "

if not defined INPUT_PATH (
    echo No input provided.
    pause
    exit /b 1
)

set "RECURSIVE_CHOICE="
set /p "RECURSIVE_CHOICE=Search subfolders too? (y/N): "
if /I "%RECURSIVE_CHOICE%"=="y" set "RECURSIVE=-r"

"%PYTHON_CMD%" "%SCRIPT_PATH%" "%INPUT_PATH%" %RECURSIVE%
set "EXIT_CODE=%ERRORLEVEL%"
echo.
pause
exit /b %EXIT_CODE%

:HELP
echo Usage:
echo   1. Drag a .heic/.heif file onto this .bat file
echo   2. Drag a folder onto this .bat file
echo   3. Or run it in cmd/powershell:
echo      convert_heic_to_jpg.bat "path\to\photo.heic"
echo      convert_heic_to_jpg.bat /r "path\to\folder"
echo.
pause
exit /b 0
