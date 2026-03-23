# HEIC to JPG Converter

This folder contains a small Python command-line tool that converts `.heic` and
`.heif` images into `.jpg`.

There is also a Windows batch launcher:

```powershell
.\convert_heic_to_jpg.bat
```

You can drag a file or folder onto the `.bat`, or run it from the terminal.

There is now also a local browser page:

```powershell
start .\heic_to_jpg_web.html
```

Open the HTML file in a browser, then drag HEIC files into the page or choose
them with the file picker.

If a file is too special for the pure browser version, use the local Python web UI:

```powershell
.\start_web_ui.bat
```

This starts a local server on `http://127.0.0.1:8765` and opens the browser.
The page still works like a normal web page, but conversion is handled by the
local Python environment, which is usually more compatible.
You can also enter a custom output folder in the page, such as
`D:\converted\jpg`, and the converted files will be written there directly.

## Setup

```powershell
cd D:\mycodex\heictojpg
python -m venv .venv
.\.venv\Scripts\python -m pip install --upgrade pip
.\.venv\Scripts\python -m pip install -r requirements.txt
```

## Usage

Convert one file:

```powershell
.\.venv\Scripts\python .\convert_heic_to_jpg.py .\photo.heic
```

Convert every HEIC/HEIF file in a folder:

```powershell
.\.venv\Scripts\python .\convert_heic_to_jpg.py .\input_folder -r
```

Use the batch launcher:

```powershell
.\convert_heic_to_jpg.bat .\photo.heic
.\convert_heic_to_jpg.bat /r .\input_folder
```

Use the local browser page:

```powershell
start .\heic_to_jpg_web.html
```

Use the Python-backed web UI:

```powershell
.\start_web_ui.bat
```

When using the Python-backed web UI:

```text
Leave "Output folder" empty -> download result directly
Fill "Output folder" -> save JPG files into that folder
```

Write output into a custom folder:

```powershell
.\.venv\Scripts\python .\convert_heic_to_jpg.py .\input_folder -r -o .\output_folder
```

Adjust JPEG quality:

```powershell
.\.venv\Scripts\python .\convert_heic_to_jpg.py .\photo.heic -q 90
```
