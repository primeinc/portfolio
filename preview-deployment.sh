#!/bin/bash

# Get repository name dynamically (same logic as build script)
if [ -n "$GITHUB_REPOSITORY" ]; then
    REPO_NAME=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f2)
else
    # Try to get from git remote
    if git remote get-url origin >/dev/null 2>&1; then
        REMOTE_URL=$(git remote get-url origin)
        # Extracts 'repo' from various URL formats
        REPO_NAME=$(echo "$REMOTE_URL" | sed -E 's#^(.*/|.*:)##; s#\.git$##')
    fi
fi

# Default if detection failed
if [ -z "$REPO_NAME" ]; then
    REPO_NAME="portfolio"
fi

echo "This script serves the 'dist' directory, which should be structured for GitHub Pages."
echo "Ensure 'dist' contains the root index.html and app subdirectories (e.g., robin-noguier/, vilinskyy/)."
echo "The root index.html should have absolute paths like '/$REPO_NAME/app_name/' set by the build script."
echo ""
echo "Repository detected: $REPO_NAME"
echo "Access the landing page at: http://localhost:8080/"
echo "Links on that page will navigate to e.g. http://localhost:8080/$REPO_NAME/app_name/"
echo "Press Ctrl+C to stop the server"
echo ""

# Check if dist exists before serving
if [ ! -d "dist" ]; then
    echo "Error: 'dist' directory not found. Please ensure it's created and populated by the build process."
    exit 1
fi

cd dist && python3 -m http.server 8080 --bind 127.0.0.1
