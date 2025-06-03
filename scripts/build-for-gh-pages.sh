#!/bin/bash
set -e

# Get repository name from GitHub environment or git remote
if [ -n "$GITHUB_REPOSITORY" ]; then
    # Running in GitHub Actions
    REPO_NAME=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f2)
    echo "Detected repo from GitHub: $REPO_NAME"
else
    # Running locally - try to get remote URL
    if git remote get-url origin >/dev/null 2>&1; then
        REMOTE_URL=$(git remote get-url origin)
        # Extracts 'repo' from 'proto://host/path/to/repo.git' or 'user@host:path/to/repo.git'
        # Also handles cases without .git suffix and various protocol/user@host combinations.
        REPO_NAME=$(echo "$REMOTE_URL" | sed -E 's#^(.*/|.*:)##; s#\.git$##')
        
        if [ -n "$REPO_NAME" ]; then
            echo "Detected repo from git remote '$REMOTE_URL': $REPO_NAME"
        fi
    fi
fi

# If repo name extraction failed, use default
if [ -z "$REPO_NAME" ]; then
    echo "Warning: Could not detect repository name, using default 'portfolio'"
    REPO_NAME="portfolio"
fi

echo "Building for repository: $REPO_NAME"
BASE_PATH="/$REPO_NAME"

# Build Robin Noguier app with dynamic base path
echo "Building Robin Noguier app..."
if ! pnpm build --filter=robin-noguier -- --base "$BASE_PATH/robin-noguier/"; then
    echo "Error: Failed to build Robin Noguier app"
    exit 1
fi

# Build Vilinskyy app with dynamic base path
echo "Building Vilinskyy app..."
if ! pnpm build --filter=vilinskyy -- --base "$BASE_PATH/vilinskyy/"; then
    echo "Error: Failed to build Vilinskyy app"
    exit 1
fi

# Create temporary landing page with correct paths
echo "Creating landing page with correct paths..."
cp index.html index-temp.html

# Use perl for cross-platform compatibility
perl -pi -e "s|href=\"./robin-noguier/\"|href=\"$BASE_PATH/robin-noguier/\"|g" index-temp.html
perl -pi -e "s|href=\"./vilinskyy/\"|href=\"$BASE_PATH/vilinskyy/\"|g" index-temp.html

# Verify builds
if [ ! -d "apps/robin-noguier/dist" ]; then
    echo "Error: Robin Noguier dist directory not found"
    exit 1
fi

if [ ! -d "apps/vilinskyy/dist" ]; then
    echo "Error: Vilinskyy dist directory not found"
    exit 1
fi

echo "Build complete!"
