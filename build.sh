#!/bin/bash
set -euo pipefail

echo "==> Installing uv (standalone Python + pip)"
export PATH="${HOME}/.local/bin:${PATH}"
if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi
uv --version

echo "==> Creating Python 3.12 virtualenv"
uv python install 3.12
uv venv .venv --python 3.12
# shellcheck disable=SC1091
source .venv/bin/activate

echo "==> Installing MkDocs dependencies"
uv pip install -r requirements.txt

if [ ! -d .git ]; then
  echo "==> No .git directory; skipping git revision dates"
  export MKDOCS_ENABLE_GIT_REVISION_DATE=false
fi

echo "==> Building site"
mkdocs build
test -f site/index.html
echo "==> Build complete"
