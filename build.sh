#!/bin/bash

# Install Python dependencies
python3 -m pip install -r requirements.txt

# Build the MkDocs site
python3 -m mkdocs build --strict 