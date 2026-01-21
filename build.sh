#!/bin/bash

# Install Python dependencies with --break-system-packages for Vercel
python3 -m pip install --break-system-packages -r requirements.txt

# Build the MkDocs site
python3 -m mkdocs build 