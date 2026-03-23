from __future__ import annotations

import io
import zipfile
from pathlib import Path

from flask import Flask, Response, render_template_string, request, send_file
from PIL import Image
from pillow_heif import register_heif_opener


register_heif_opener()

app = Flask(__name__)
SUPPORTED_EXTENSIONS = {".heic", ".heif"}
DEFAULT_OUTPUT_FOLDER = (Path(__file__).resolve().parent / "output").resolve()

HTML = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HEIC 转 JPG 网页工具</title>
  <style>
    :root {
      --bg: #f4efe6;
      --paper: rgba(255, 251, 245, 0.9);
      --ink: #1f2933;
      --muted: #5b6672;
      --accent: #c95b35;
      --accent-soft: rgba(201, 91, 53, 0.18);
      --line: rgba(31, 41, 51, 0.12);
      --shadow: 0 24px 70px rgba(62, 33, 17, 0.14);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Aptos", "Trebuchet MS", sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at top left, rgba(255, 182, 126, 0.5), transparent 28%),
        radial-gradient(circle at 82% 12%, rgba(214, 108, 63, 0.25), transparent 24%),
        linear-gradient(160deg, #f8f4ed 0%, #f2e6d8 42%, #ead8c2 100%);
      padding: 24px 14px 40px;
    }

    .shell {
      max-width: 980px;
      margin: 0 auto;
      display: grid;
      gap: 18px;
    }

    .hero, .panel {
      background: var(--paper);
      border: 1px solid rgba(255, 255, 255, 0.72);
      border-radius: 28px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(14px);
    }

    .hero { padding: 28px; }
    .panel { padding: 22px; }

    .eyebrow {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 999px;
      background: white;
      color: var(--accent);
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 14px 0 10px;
      font-size: clamp(32px, 6vw, 54px);
      line-height: 0.96;
      letter-spacing: -0.05em;
      max-width: 9ch;
    }

    p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
    }

    .dropzone {
      border: 2px dashed rgba(201, 91, 53, 0.35);
      border-radius: 24px;
      padding: 28px 16px;
      text-align: center;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.26)),
        var(--accent-soft);
      transition: transform 150ms ease, border-color 150ms ease;
    }

    .dropzone.dragover {
      transform: translateY(-2px);
      border-color: var(--accent);
    }

    .controls {
      margin-top: 18px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      align-items: end;
    }

    .control {
      display: grid;
      gap: 8px;
    }

    .label {
      font-size: 14px;
      color: var(--muted);
    }

    .quality-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    input[type="text"] {
      width: 100%;
      padding: 13px 14px;
      border: 1px solid rgba(31, 41, 51, 0.12);
      border-radius: 14px;
      background: white;
      font: inherit;
      color: var(--ink);
    }

    input[type="range"] {
      width: 100%;
      accent-color: var(--accent);
    }

    .quality-badge {
      min-width: 54px;
      text-align: center;
      padding: 8px 10px;
      border-radius: 12px;
      background: white;
      font-weight: 700;
    }

    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    button {
      border: 0;
      border-radius: 16px;
      padding: 13px 18px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .primary {
      background: linear-gradient(135deg, var(--accent), #df855d);
      color: white;
      box-shadow: 0 16px 30px rgba(201, 91, 53, 0.24);
    }

    .secondary {
      background: white;
      color: var(--ink);
      border: 1px solid rgba(31, 41, 51, 0.08);
    }

    .hint, .status {
      margin-top: 16px;
      font-size: 14px;
      color: var(--muted);
    }

    .status.error {
      color: #992211;
    }

    .hidden {
      display: none;
    }

    @media (max-width: 680px) {
      .hero, .panel {
        padding: 18px;
        border-radius: 22px;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <section class="hero">
      <div class="eyebrow">Python Powered</div>
      <h1>HEIC 直接转 JPG</h1>
      <p>这个版本不再依赖浏览器自己解码 HEIC，而是由你本机 Python 在后台完成转换，所以对特殊 HEIC 文件更稳。你既可以直接下载结果，也可以把结果保存到你指定的本地文件夹。</p>
    </section>

    <section class="panel">
      <form id="convertForm" action="/convert" method="post" enctype="multipart/form-data">
        <div id="dropzone" class="dropzone">
          <h2>拖拽 HEIC 文件到这里</h2>
          <p>也可以点击按钮选择多个 `.heic` 或 `.heif` 文件。你可以选择直接下载，或者保存到自定义输出目录。</p>
          <div class="button-row" style="justify-content:center; margin-top:18px;">
            <button id="pickButton" class="secondary" type="button">选择图片</button>
            <button class="primary" type="submit">开始转换</button>
          </div>
          <input id="fileInput" class="hidden" type="file" name="files" accept=".heic,.heif,image/heic,image/heif" multiple required>
        </div>

        <div class="controls">
          <div class="control">
            <div class="label">JPG 质量</div>
            <div class="quality-row">
              <input id="qualityRange" type="range" name="quality" min="70" max="100" step="1" value="92">
              <div id="qualityValue" class="quality-badge">92%</div>
            </div>
          </div>
          <div class="control">
            <div class="label">当前已选择</div>
            <div id="selectionSummary" class="hint">还没有文件</div>
          </div>
          <div class="control" style="grid-column: 1 / -1;">
            <div class="label">输出文件夹</div>
            <input
              id="outputFolder"
              type="text"
              name="output_folder"
              placeholder="留空则直接下载；填写例如 D:\\converted\\jpg"
              value="{{ output_folder }}"
            >
            <div class="button-row">
              <button id="fillDefaultFolderButton" class="secondary" type="button">使用默认输出目录</button>
            </div>
            <div class="hint">留空：单文件下载 JPG，多文件下载 ZIP。填写目录：服务器会把转换后的 JPG 直接保存到那个文件夹。</div>
            <div class="hint">默认输出目录：{{ default_output_folder }}</div>
          </div>
        </div>
      </form>

      {% if error %}
      <div class="status error">{{ error }}</div>
      {% elif success %}
      <div class="status">{{ success }}</div>
      {% else %}
      <div class="status">准备好后点击“开始转换”。</div>
      {% endif %}

      <div class="hint">说明：这个网页只负责上传和保存，真正的 HEIC 解码走的是你本机的 `Pillow + pillow-heif`，兼容性通常比纯前端方案更好。</div>
    </section>
  </main>

  <script>
    const fileInput = document.getElementById("fileInput");
    const pickButton = document.getElementById("pickButton");
    const qualityRange = document.getElementById("qualityRange");
    const qualityValue = document.getElementById("qualityValue");
    const selectionSummary = document.getElementById("selectionSummary");
    const dropzone = document.getElementById("dropzone");
    const outputFolder = document.getElementById("outputFolder");
    const fillDefaultFolderButton = document.getElementById("fillDefaultFolderButton");
    const defaultOutputFolder = {{ default_output_folder_js|safe }};

    function updateSummary() {
      qualityValue.textContent = `${qualityRange.value}%`;
      const files = Array.from(fileInput.files || []);
      if (!files.length) {
        selectionSummary.textContent = "还没有文件";
        return;
      }
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
      const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
      selectionSummary.textContent = `共 ${files.length} 个文件，原始大小 ${totalMB} MB`;
    }

    pickButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", updateSummary);
    qualityRange.addEventListener("input", updateSummary);
    outputFolder.addEventListener("input", updateSummary);
    fillDefaultFolderButton.addEventListener("click", () => {
      outputFolder.value = defaultOutputFolder;
    });

    ["dragenter", "dragover"].forEach((type) => {
      dropzone.addEventListener(type, (event) => {
        event.preventDefault();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((type) => {
      dropzone.addEventListener(type, (event) => {
        event.preventDefault();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (event) => {
      const incoming = Array.from(event.dataTransfer.files || []).filter((file) => {
        const lower = file.name.toLowerCase();
        return lower.endsWith(".heic") || lower.endsWith(".heif");
      });

      if (!incoming.length) {
        return;
      }

      const dt = new DataTransfer();
      incoming.forEach((file) => dt.items.add(file));
      fileInput.files = dt.files;
      updateSummary();
    });

    updateSummary();
  </script>
</body>
</html>
"""


def sanitize_quality(raw_quality: str | None) -> int:
    try:
        quality = int(raw_quality or "92")
    except ValueError:
        quality = 92
    return min(100, max(1, quality))


def resolve_output_folder(raw_output_folder: str | None) -> Path | None:
    if not raw_output_folder or not raw_output_folder.strip():
        return None
    return Path(raw_output_folder.strip()).expanduser()


def convert_heic_to_jpg(file_storage, quality: int) -> tuple[str, bytes]:
    source_name = Path(file_storage.filename or "image.heic").name
    source_suffix = Path(source_name).suffix.lower()
    if source_suffix not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {source_name}")

    payload = file_storage.read()
    if not payload:
        raise ValueError(f"Empty file: {source_name}")

    with Image.open(io.BytesIO(payload)) as image:
        converted = image.convert("RGB")
        output = io.BytesIO()
        converted.save(output, format="JPEG", quality=quality, optimize=True)
        output_name = f"{Path(source_name).stem}.jpg"
        return output_name, output.getvalue()


def render_page(
    *,
    error: str | None = None,
    success: str | None = None,
    output_folder: str = "",
) -> str:
    return render_template_string(
        HTML,
        error=error,
        success=success,
        output_folder=output_folder,
        default_output_folder=str(DEFAULT_OUTPUT_FOLDER),
        default_output_folder_js=repr(str(DEFAULT_OUTPUT_FOLDER)),
    )


@app.get("/")
def index() -> str:
    return render_page()


@app.post("/convert")
def convert() -> Response:
    files = request.files.getlist("files")
    quality = sanitize_quality(request.form.get("quality"))
    raw_output_folder = request.form.get("output_folder", "")
    output_folder = resolve_output_folder(raw_output_folder)

    valid_files = [file for file in files if file and file.filename]
    if not valid_files:
        return render_page(
            error="请先选择至少一个 HEIC/HEIF 文件。",
            output_folder=raw_output_folder,
        ), 400

    converted: list[tuple[str, bytes]] = []
    try:
        for file in valid_files:
            converted.append(convert_heic_to_jpg(file, quality))
    except Exception as exc:  # noqa: BLE001
        return render_page(
            error=f"转换失败：{exc}",
            output_folder=raw_output_folder,
        ), 400

    if output_folder is not None:
        try:
            output_folder.mkdir(parents=True, exist_ok=True)
            for output_name, output_bytes in converted:
                (output_folder / output_name).write_bytes(output_bytes)
        except Exception as exc:  # noqa: BLE001
            return render_page(
                error=f"保存失败：{exc}",
                output_folder=raw_output_folder,
            ), 400

        return render_page(
            success=(
                f"转换完成，已保存 {len(converted)} 个 JPG 到："
                f" {output_folder}"
            ),
            output_folder=raw_output_folder,
        )

    if len(converted) == 1:
        output_name, output_bytes = converted[0]
        return send_file(
            io.BytesIO(output_bytes),
            mimetype="image/jpeg",
            as_attachment=True,
            download_name=output_name,
        )

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for output_name, output_bytes in converted:
            archive.writestr(output_name, output_bytes)
    zip_buffer.seek(0)

    return send_file(
        zip_buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name="heic_to_jpg_results.zip",
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8765, debug=False)
