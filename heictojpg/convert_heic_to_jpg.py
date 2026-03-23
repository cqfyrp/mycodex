from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image
from pillow_heif import register_heif_opener


SUPPORTED_EXTENSIONS = {".heic", ".heif"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert HEIC/HEIF images to JPG."
    )
    parser.add_argument(
        "input_path",
        help="A HEIC/HEIF file or a directory that contains HEIC/HEIF files.",
    )
    parser.add_argument(
        "-o",
        "--output",
        help=(
            "Output file or directory. Defaults to the input file's folder for a "
            "single file, or '<input>/jpg_output' for a directory."
        ),
    )
    parser.add_argument(
        "-q",
        "--quality",
        type=int,
        default=95,
        help="JPEG quality from 1 to 100. Default: 95.",
    )
    parser.add_argument(
        "-r",
        "--recursive",
        action="store_true",
        help="Search subdirectories when the input path is a directory.",
    )
    return parser.parse_args()


def validate_quality(quality: int) -> int:
    if 1 <= quality <= 100:
        return quality
    raise ValueError("JPEG quality must be between 1 and 100.")


def iter_input_files(input_path: Path, recursive: bool) -> list[Path]:
    if input_path.is_file():
        if input_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            raise ValueError("Input file must have a .heic or .heif extension.")
        return [input_path]

    if not input_path.is_dir():
        raise FileNotFoundError(f"Input path does not exist: {input_path}")

    pattern = "**/*" if recursive else "*"
    return sorted(
        file_path
        for file_path in input_path.glob(pattern)
        if file_path.is_file() and file_path.suffix.lower() in SUPPORTED_EXTENSIONS
    )


def resolve_output_path(
    source_path: Path,
    input_root: Path,
    output_target: Path | None,
    is_directory_input: bool,
) -> Path:
    if not is_directory_input:
        if output_target is None:
            return source_path.with_suffix(".jpg")
        if output_target.suffix.lower() == ".jpg":
            return output_target
        return output_target / f"{source_path.stem}.jpg"

    if output_target is None:
        base_dir = input_root / "jpg_output"
    else:
        base_dir = output_target

    relative_parent = source_path.parent.relative_to(input_root)
    return base_dir / relative_parent / f"{source_path.stem}.jpg"


def convert_file(source_path: Path, destination_path: Path, quality: int) -> None:
    destination_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source_path) as image:
        # JPEG does not support alpha; RGB keeps the output broadly compatible.
        converted = image.convert("RGB")
        converted.save(destination_path, "JPEG", quality=quality, optimize=True)


def main() -> int:
    register_heif_opener()
    args = parse_args()

    input_path = Path(args.input_path).expanduser().resolve()
    output_target = Path(args.output).expanduser().resolve() if args.output else None

    try:
        quality = validate_quality(args.quality)
        input_files = iter_input_files(input_path, args.recursive)
    except (FileNotFoundError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if not input_files:
        print("No HEIC/HEIF files found.")
        return 0

    is_directory_input = input_path.is_dir()
    failures = 0

    for source_path in input_files:
        destination_path = resolve_output_path(
            source_path=source_path,
            input_root=input_path,
            output_target=output_target,
            is_directory_input=is_directory_input,
        )
        try:
            convert_file(source_path, destination_path, quality)
            print(f"Converted: {source_path} -> {destination_path}")
        except Exception as exc:  # noqa: BLE001
            failures += 1
            print(f"Failed: {source_path} ({exc})", file=sys.stderr)

    if failures:
        print(f"Finished with {failures} failure(s).", file=sys.stderr)
        return 1

    print(f"Finished. Converted {len(input_files)} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
