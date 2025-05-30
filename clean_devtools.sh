#!/usr/bin/env bash

set -euo pipefail

# Set working directory to your portfolio root
PORTFOLIO_DIR="${PORTFOLIO_DIR:-/mnt/c/Users/WillPeters/dev/portfolio}"
cd "$PORTFOLIO_DIR"

echo "=== Cleaning Node/JS dev tooling and artifacts ==="

# Remove local and global Node tooling directories (Linux/macOS/WSL)
rm -rf ~/.volta ~/.fnm ~/.nvm ~/.npm ~/.pnpm-store ~/.node ~/.cache/node
rm -rf ~/Library/Application\ Support/fnm ~/.local/share/fnm ~/.config/fnm

# Remove Windows Volta artifacts if running under WSL/Windows
rm -rf /mnt/c/Users/WillPeters/AppData/Local/Volta

# Remove per-project artifacts
rm -rf node_modules pnpm-lock.yaml
rm -rf apps/*/node_modules packages/*/node_modules
rm -f .dev-server.pid .setup.lock.lock .dev-server-wrapper.sh stop-dev-server.sh

# Clean up bash/zsh configs for any lingering Volta/FNM/NVM env lines
for PROFILE in ~/.bashrc ~/.zshrc; do
    [ -f "$PROFILE" ] && sed -i '/volta/d; /fnm/d; /nvm/d; /VOLTA/d; /FNM/d; /NVM/d' "$PROFILE" || true
done

# Optionally, clean up extra setup, test, or debug scripts/logs if desired:
find "$PORTFOLIO_DIR" -maxdepth 1 \( -name 'debug_*' -o -name 'test_*' -o -name '*.sh' \) ! -name 'dev_setup.sh' -exec rm -f {} +

# Remove hidden setup logs (optional)
rm -f "$PORTFOLIO_DIR"/.setup-* "$PORTFOLIO_DIR"/.setup-health.json 2>/dev/null || true

# Reset shell environment
hash -r

# Double-check: Report any remaining Node/JS tools in $PATH
FOUND_TOOLS=$(which node npm pnpm volta fnm nvm 2>&1 | grep -v "not found" || true)
if [ -n "$FOUND_TOOLS" ]; then
    echo "❗ Still present in PATH:"
    echo "$FOUND_TOOLS"
else
    echo "✅ System is clean – no Node.js tools found."
fi
