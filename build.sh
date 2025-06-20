#!/bin/bash

# Install Python dependencies
pip install -r requirements.txt

# Build the MkDocs site
mkdocs build --strict 