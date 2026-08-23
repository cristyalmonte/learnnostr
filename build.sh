#!/bin/bash
set -euo pipefail

echo "==> Python"
python3 --version
python3 -c "import sys; print(sys.executable)"

if ! python3 -m pip --version >/dev/null 2>&1; then
  echo "==> pip missing; bootstrapping"
  python3 -m ensurepip --upgrade --user >/dev/null 2>&1 || true
  if ! python3 -m pip --version >/dev/null 2>&1; then
    curl -sS https://bootstrap.pypa.io/get-pip.py | python3 - --user
  fi
fi

echo "==> Installing Python dependencies"
python3 -m pip install --user --upgrade pip
# Vercel / PEP 668: --break-system-packages is required on some images;
# --user is required on others. Try the combination, then fall back.
python3 -m pip install --user --break-system-packages -r requirements.txt \
  || python3 -m pip install --user -r requirements.txt \
  || python3 -m pip install --break-system-packages -r requirements.txt

export PATH="${HOME}/.local/bin:${PATH}"

if [ ! -d .git ]; then
  echo "==> No .git directory; skipping git revision dates"
  export MKDOCS_ENABLE_GIT_REVISION_DATE=false
fi

echo "==> Building MkDocs site"
python3 -m mkdocs build
echo "==> Build complete"
ls site >/dev/null
