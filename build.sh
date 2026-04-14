#!/bin/bash
set -e

# Install Python dependencies
python3 -m pip install --user -r requirements.txt

# Build the MkDocs site
python3 -m mkdocs build 