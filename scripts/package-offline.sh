#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PYTHON="${PYTHON:-python3}"
VERSION="${1:-$(git describe --tags --always 2>/dev/null || git rev-parse --short HEAD)}"
SAFE_VERSION="$(printf '%s' "$VERSION" | tr -cs 'A-Za-z0-9._-' '-')"
PACKAGE_NAME="learnnostr-${SAFE_VERSION}"
DIST_DIR="$ROOT_DIR/dist"
PACKAGE_DIR="$DIST_DIR/$PACKAGE_NAME"
ZIP_PATH="$DIST_DIR/learnnostr-offline-${SAFE_VERSION}.zip"
CHECKSUM_PATH="$ZIP_PATH.sha256"

rm -rf "$PACKAGE_DIR" "$ZIP_PATH" "$CHECKSUM_PATH"
mkdir -p "$DIST_DIR"

echo "==> Building self-contained site"
MKDOCS_ENABLE_GIT_REVISION_DATE=false \
  "$PYTHON" -m mkdocs build --clean --site-dir "$PACKAGE_DIR"

cp "$ROOT_DIR/OFFLINE-README.md" "$PACKAGE_DIR/README.md"

echo "==> Checking for remote runtime assets"
"$PYTHON" - "$PACKAGE_DIR" <<'PY'
from html.parser import HTMLParser
from pathlib import Path
import sys

root = Path(sys.argv[1])
remote_assets = []

class AssetParser(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.source = source

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        url = None

        if tag in {"script", "img", "source", "iframe"}:
            url = values.get("src")
        elif tag == "link":
            rel = set(values.get("rel", "").split())
            if rel & {"stylesheet", "icon", "preload", "modulepreload"}:
                url = values.get("href")

        if url and url.startswith(("http://", "https://")):
            remote_assets.append(f"{self.source}: {tag} -> {url}")

for html_file in root.rglob("*.html"):
    parser = AssetParser(html_file.relative_to(root))
    parser.feed(html_file.read_text(encoding="utf-8"))

if remote_assets:
    print("Remote runtime assets remain:", file=sys.stderr)
    print("\n".join(remote_assets), file=sys.stderr)
    raise SystemExit(1)
PY

echo "==> Creating $ZIP_PATH"
"$PYTHON" - "$DIST_DIR" "$PACKAGE_NAME" "$ZIP_PATH" <<'PY'
from pathlib import Path
import shutil
import sys

dist = Path(sys.argv[1])
package_name = sys.argv[2]
zip_path = Path(sys.argv[3])
archive = shutil.make_archive(
    str(zip_path.with_suffix("")),
    "zip",
    root_dir=dist,
    base_dir=package_name,
)
if Path(archive) != zip_path:
    Path(archive).replace(zip_path)
PY

"$PYTHON" - "$ZIP_PATH" "$CHECKSUM_PATH" <<'PY'
from pathlib import Path
import hashlib
import sys

zip_path = Path(sys.argv[1])
checksum_path = Path(sys.argv[2])
digest = hashlib.sha256(zip_path.read_bytes()).hexdigest()
checksum_path.write_text(f"{digest}  {zip_path.name}\n", encoding="utf-8")
PY

echo "==> Offline package ready"
echo "$ZIP_PATH"
echo "$CHECKSUM_PATH"
