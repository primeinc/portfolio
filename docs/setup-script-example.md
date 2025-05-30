```bash
#!/usr/bin/env bash

# Portfolio Monorepo Development Environment Setup
# Works for both human developers and CI environments
# Implements best practices from Vercel, Microsoft Rush, and Google monorepos

set -euo pipefail

# ============================================================================
# Configuration
# ============================================================================

# Version requirements (from package.json)
REQUIRED_NODE_VERSION="20.17.0"
REQUIRED_PNPM_VERSION="8.15.0"
NODE_VERSION_RANGE=">=18.0.0 <21.0.0"

# Volta configuration for automatic version management
VOLTA_VERSION="1.1.1"

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR" && pwd)"
LOG_FILE="$PROJECT_ROOT/.dev-setup.log"
PID_FILE="$PROJECT_ROOT/.dev-server.pid"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# CI detection
IS_CI="${CI:-false}"
IS_GITHUB_ACTIONS="${GITHUB_ACTIONS:-false}"
IS_INTERACTIVE=true

# Colors for output (disabled in CI)
if [[ "$IS_CI" == "true" ]] || [[ ! -t 1 ]]; then
  IS_INTERACTIVE=false
  RED=""
  GREEN=""
  YELLOW=""
  BLUE=""
  MAGENTA=""
  CYAN=""
  BOLD=""
  NC=""
else
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  MAGENTA='\033[0;35m'
  CYAN='\033[0;36m'
  BOLD='\033[1m'
  NC='\033[0m'
fi

# ============================================================================
# Utility Functions
# ============================================================================

log() {
  local level=$1
  shift
  local message="$*"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  # Log to file
  echo "[$timestamp] [$level] $message" >> "$LOG_FILE"

  # Log to console with colors
  case $level in
    ERROR)
      echo -e "${RED}❌ ERROR:${NC} $message" >&2
      ;;
    SUCCESS)
      echo -e "${GREEN}✅ SUCCESS:${NC} $message"
      ;;
    WARNING)
      echo -e "${YELLOW}⚠️  WARNING:${NC} $message"
      ;;
    INFO)
      echo -e "${BLUE}ℹ️  INFO:${NC} $message"
      ;;
    DEBUG)
      if [[ "${DEBUG:-false}" == "true" ]]; then
        echo -e "${CYAN}🔍 DEBUG:${NC} $message"
      fi
      ;;
    *)
      echo "$message"
      ;;
  esac
}

# Check if command exists
command_exists() {
  command -v "$1" &> /dev/null
}

# Compare semantic versions
version_compare() {
  local version1=$1
  local version2=$2
  local operator=${3:-">="}

  # Use Node.js for accurate semver comparison
  if command_exists node; then
    node -e "
      const semver = require('semver');
      const result = semver.satisfies('$version1', '$operator$version2');
      process.exit(result ? 0 : 1);
    " 2>/dev/null || {
      # Fallback to simple comparison if semver not available
      [[ "$version1" == "$version2" ]]
    }
  else
    # Basic fallback comparison
    [[ "$version1" == "$version2" ]]
  fi
}

# Get Node.js version
get_node_version() {
  if command_exists node; then
    node -v | sed 's/v//'
  else
    echo "0.0.0"
  fi
}

# Get pnpm version
get_pnpm_version() {
  if command_exists pnpm; then
    pnpm -v
  else
    echo "0.0.0"
  fi
}

# Detect OS
detect_os() {
  case "$(uname -s)" in
    Linux*)
      if grep -q Microsoft /proc/version 2>/dev/null; then
        echo "wsl"
      else
        echo "linux"
      fi
      ;;
    Darwin*)
      echo "macos"
      ;;
    CYGWIN*|MINGW*|MSYS*)
      echo "windows"
      ;;
    *)
      echo "unknown"
      ;;
  esac
}

# ============================================================================
# Pre-flight Checks
# ============================================================================

preflight_checks() {
  log INFO "Running pre-flight checks..."

  # Check OS
  local os=$(detect_os)
  log INFO "Detected OS: $os"

  if [[ "$os" == "windows" ]] && [[ "$IS_CI" != "true" ]]; then
    log WARNING "Native Windows detected. WSL2 is recommended for best performance."
    log INFO "See: https://docs.microsoft.com/en-us/windows/wsl/install"
  fi

  # Check for required commands
  local missing_commands=()

  if ! command_exists git; then
    missing_commands+=("git")
  fi

  if ! command_exists curl && ! command_exists wget; then
    missing_commands+=("curl or wget")
  fi

  if [[ ${#missing_commands[@]} -gt 0 ]]; then
    log ERROR "Missing required commands: ${missing_commands[*]}"
    log INFO "Please install missing commands and try again."
    exit 1
  fi

  # Check if we're in a git repository
  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log WARNING "Not in a git repository. Some features may not work correctly."
  fi

  log SUCCESS "Pre-flight checks passed"
}

# ============================================================================
# Volta Setup (Preferred Node Version Manager)
# ============================================================================

setup_volta() {
  log INFO "Setting up Volta for automatic Node.js version management..."

  if command_exists volta; then
    local installed_volta_version=$(volta --version 2>/dev/null | cut -d' ' -f2)
    log INFO "Volta $installed_volta_version is already installed"
  else
    log INFO "Installing Volta $VOLTA_VERSION..."

    # Install Volta based on OS
    local os=$(detect_os)
    case "$os" in
      macos|linux|wsl)
        curl -sSf https://get.volta.sh | bash -s -- --skip-setup
        export VOLTA_HOME="$HOME/.volta"
        export PATH="$VOLTA_HOME/bin:$PATH"

        # Add to shell profile if interactive
        if [[ "$IS_INTERACTIVE" == "true" ]] && [[ "$IS_CI" != "true" ]]; then
          local shell_profile=""
          if [[ -n "${BASH_VERSION:-}" ]]; then
            shell_profile="$HOME/.bashrc"
          elif [[ -n "${ZSH_VERSION:-}" ]]; then
            shell_profile="$HOME/.zshrc"
          fi

          if [[ -n "$shell_profile" ]] && [[ -f "$shell_profile" ]]; then
            if ! grep -q "VOLTA_HOME" "$shell_profile"; then
              echo "" >> "$shell_profile"
              echo "# Volta configuration" >> "$shell_profile"
              echo "export VOLTA_HOME=\"\$HOME/.volta\"" >> "$shell_profile"
              echo "export PATH=\"\$VOLTA_HOME/bin:\$PATH\"" >> "$shell_profile"
              log SUCCESS "Added Volta to $shell_profile"
            fi
          fi
        fi
        ;;
      windows)
        log WARNING "Please install Volta manually from https://volta.sh"
        log INFO "Using fallback Node.js detection..."
        return 1
        ;;
    esac
  fi

  # Pin Node and pnpm versions in package.json
  if command_exists volta; then
    log INFO "Configuring Volta project versions..."
    volta pin node@$REQUIRED_NODE_VERSION 2>/dev/null || true
    volta pin pnpm@$REQUIRED_PNPM_VERSION 2>/dev/null || true

    # Verify package.json has volta config
    if [[ -f "package.json" ]] && ! grep -q '"volta"' package.json; then
      log INFO "Adding Volta configuration to package.json..."
      # This would normally use jq or similar, but keeping it simple
      node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.volta = {
          node: '$REQUIRED_NODE_VERSION',
          pnpm: '$REQUIRED_PNPM_VERSION'
        };
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
      "
    fi
  fi
}

# ============================================================================
# Node.js Setup
# ============================================================================

setup_node() {
  log INFO "Checking Node.js installation..."

  local current_version=$(get_node_version)

  if [[ "$current_version" == "0.0.0" ]]; then
    log ERROR "Node.js is not installed"

    if command_exists volta; then
      log INFO "Installing Node.js $REQUIRED_NODE_VERSION via Volta..."
      volta install node@$REQUIRED_NODE_VERSION
    else
      log ERROR "Please install Node.js $NODE_VERSION_RANGE"
      log INFO "Download from: https://nodejs.org/"
      exit 1
    fi
  else
    log INFO "Found Node.js $current_version"

    # Check version compatibility
    if ! node -e "process.exit(require('semver').satisfies('$current_version', '$NODE_VERSION_RANGE') ? 0 : 1)" 2>/dev/null; then
      log WARNING "Node.js $current_version is outside the supported range: $NODE_VERSION_RANGE"

      if command_exists volta; then
        log INFO "Switching to Node.js $REQUIRED_NODE_VERSION via Volta..."
        volta install node@$REQUIRED_NODE_VERSION
        volta use node@$REQUIRED_NODE_VERSION
      else
        log ERROR "Please install Node.js $NODE_VERSION_RANGE"
        exit 1
      fi
    else
      log SUCCESS "Node.js version is compatible"
    fi
  fi
}

# ============================================================================
# pnpm Setup
# ============================================================================

setup_pnpm() {
  log INFO "Checking pnpm installation..."

  local current_version=$(get_pnpm_version)

  if [[ "$current_version" == "0.0.0" ]]; then
    log INFO "Installing pnpm $REQUIRED_PNPM_VERSION..."

    if command_exists volta; then
      volta install pnpm@$REQUIRED_PNPM_VERSION
    else
      npm install -g pnpm@$REQUIRED_PNPM_VERSION
    fi
  else
    log INFO "Found pnpm $current_version"

    if [[ "$current_version" != "$REQUIRED_PNPM_VERSION" ]]; then
      log WARNING "pnpm $current_version installed, but project requires $REQUIRED_PNPM_VERSION"

      if [[ "$IS_CI" == "true" ]]; then
        log ERROR "CI requires exact pnpm version $REQUIRED_PNPM_VERSION"
        exit 1
      else
        log INFO "Installing pnpm $REQUIRED_PNPM_VERSION..."
        if command_exists volta; then
          volta install pnpm@$REQUIRED_PNPM_VERSION
        else
          npm install -g pnpm@$REQUIRED_PNPM_VERSION
        fi
      fi
    fi
  fi

  # Verify pnpm is accessible
  if ! command_exists pnpm; then
    log ERROR "pnpm installation failed"
    exit 1
  fi

  log SUCCESS "pnpm $REQUIRED_PNPM_VERSION is ready"
}

# ============================================================================
# Dependencies Installation
# ============================================================================

install_dependencies() {
  log INFO "Installing project dependencies..."

  # Clean install in CI
  if [[ "$IS_CI" == "true" ]]; then
    log INFO "Running clean install for CI..."
    pnpm install --frozen-lockfile --prefer-offline
  else
    # Regular install for development
    pnpm install
  fi

  if [[ $? -ne 0 ]]; then
    log ERROR "Failed to install dependencies"
    log INFO "Check the log file for details: $LOG_FILE"
    exit 1
  fi

  log SUCCESS "Dependencies installed successfully"
}

# ============================================================================
# Environment Setup
# ============================================================================

setup_environment() {
  log INFO "Setting up environment files..."

  local env_created=0

  # Root .env.local
  if [[ -f ".env.example" ]]; then
    if [[ -f ".env.local" ]]; then
      log DEBUG ".env.local already exists, skipping..."
    else
      cp .env.example .env.local
      log SUCCESS "Created .env.local from .env.example"
      ((env_created++))
    fi
  fi

  # App-specific .env.local files
  for app_dir in apps/*/; do
    if [[ -d "$app_dir" ]] && [[ -f "$app_dir/.env.example" ]]; then
      if [[ -f "$app_dir/.env.local" ]]; then
        log DEBUG "$app_dir.env.local already exists, skipping..."
      else
        cp "$app_dir/.env.example" "$app_dir/.env.local"
        log SUCCESS "Created $app_dir.env.local"
        ((env_created++))
      fi
    fi
  done

  if [[ $env_created -eq 0 ]]; then
    log INFO "No new environment files created"
  fi
}

# ============================================================================
# Build Shared Packages
# ============================================================================

build_packages() {
  log INFO "Building shared packages..."

  # Check if packages directory has any packages
  if [[ -d "packages" ]] && find packages -mindepth 1 -maxdepth 1 -type d | grep -q .; then
    pnpm turbo run build --filter="./packages/*" || {
      log WARNING "Some packages failed to build (this may be expected for empty packages)"
    }
  else
    log INFO "No shared packages to build"
  fi
}

# ============================================================================
# Git Hooks Setup
# ============================================================================

setup_git_hooks() {
  if [[ "$IS_CI" == "true" ]]; then
    log DEBUG "Skipping git hooks setup in CI"
    return
  fi

  log INFO "Setting up git hooks..."

  if [[ -f "package.json" ]] && grep -q '"prepare".*husky' package.json; then
    pnpm run prepare || {
      log WARNING "Failed to setup git hooks"
    }
  else
    log DEBUG "No git hooks configuration found"
  fi
}

# ============================================================================
# Development Server Management
# ============================================================================

check_port() {
  local port=$1
  if command_exists lsof; then
    lsof -ti:$port >/dev/null 2>&1
  elif command_exists netstat; then
    netstat -an | grep -q ":$port.*LISTEN"
  else
    # Fallback: try to connect
    timeout 1 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null
  fi
}

cleanup_old_processes() {
  if [[ -f "$PID_FILE" ]]; then
    local old_pid=$(cat "$PID_FILE")
    if kill -0 "$old_pid" 2>/dev/null; then
      log WARNING "Found existing dev server (PID: $old_pid)"
      log INFO "Stopping old server..."
      kill -TERM "$old_pid" 2>/dev/null || true
      sleep 2
      kill -KILL "$old_pid" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
  fi
}

start_dev_server() {
  if [[ "$IS_CI" == "true" ]]; then
    log INFO "Skipping dev server start in CI environment"
    return
  fi

  if [[ "$IS_INTERACTIVE" != "true" ]]; then
    log INFO "Non-interactive mode: skipping dev server start"
    log INFO "Run 'pnpm dev' to start the development server"
    return
  fi

  log INFO "Starting development server..."

  # Check default port (from Vite config or default 5173)
  local dev_port=5173
  if [[ -f "apps/robin-noguier/vite.config.ts" ]]; then
    # Try to extract port from config (simplified check)
    local configured_port=$(grep -oP 'port:\s*\K\d+' apps/robin-noguier/vite.config.ts 2>/dev/null || echo "5173")
    dev_port=${configured_port:-5173}
  fi

  # Clean up old processes
  cleanup_old_processes

  # Check if port is available
  if check_port $dev_port; then
    log ERROR "Port $dev_port is already in use!"
    log INFO "Please stop the process using port $dev_port or change the port in vite.config.ts"
    return 1
  fi

  # Create log directory
  mkdir -p logs
  local server_log="logs/dev-server-$TIMESTAMP.log"

  # Start server with proper signal handling
  log INFO "Starting dev server on port $dev_port..."

  # Create a wrapper script for proper signal handling
  cat > .dev-server-wrapper.sh << 'EOF'
#!/bin/bash
exec pnpm dev "$@"
EOF
  chmod +x .dev-server-wrapper.sh

  # Start server in background
  nohup ./.dev-server-wrapper.sh > "$server_log" 2>&1 &
  local server_pid=$!
  echo $server_pid > "$PID_FILE"

  # Wait for server to start
  log INFO "Waiting for server to start..."
  local max_attempts=30
  local attempt=0

  while [ $attempt -lt $max_attempts ]; do
    if check_port $dev_port; then
      log SUCCESS "Development server is running!"
      log INFO "Server URL: http://localhost:$dev_port"
      log INFO "Server logs: $server_log"
      log INFO "Process ID: $server_pid"

      # Create stop script
      cat > stop-dev-server.sh << EOF
#!/bin/bash
if [[ -f "$PID_FILE" ]]; then
  PID=\$(cat "$PID_FILE")
  if kill -0 "\$PID" 2>/dev/null; then
    echo "Stopping dev server (PID: \$PID)..."
    kill -TERM "\$PID"
    sleep 2
    if kill -0 "\$PID" 2>/dev/null; then
      kill -KILL "\$PID"
    fi
    rm -f "$PID_FILE"
    echo "✅ Dev server stopped"
  else
    echo "⚠️  No running dev server found with PID \$PID"
    rm -f "$PID_FILE"
  fi
else
  echo "⚠️  No PID file found"
fi
EOF
      chmod +x stop-dev-server.sh

      # Try to open browser
      if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:$dev_port" 2>/dev/null || true
      elif command_exists xdg-open; then
        xdg-open "http://localhost:$dev_port" 2>/dev/null || true
      elif [[ "$OS" == "Windows_NT" ]]; then
        start "http://localhost:$dev_port" 2>/dev/null || true
      fi

      return 0
    fi

    ((attempt++))
    sleep 1
  done

  log ERROR "Dev server failed to start within 30 seconds"
  log INFO "Check the server log: $server_log"
  tail -20 "$server_log"
  return 1
}

# ============================================================================
# Validation
# ============================================================================

validate_setup() {
  log INFO "Validating setup..."

  local validation_passed=true

  # Check Node.js
  if ! command_exists node; then
    log ERROR "Node.js is not available"
    validation_passed=false
  fi

  # Check pnpm
  if ! command_exists pnpm; then
    log ERROR "pnpm is not available"
    validation_passed=false
  fi

  # Check node_modules
  if [[ ! -d "node_modules" ]]; then
    log ERROR "node_modules directory not found"
    validation_passed=false
  fi

  # Check TypeScript
  if ! pnpm exec tsc --version &>/dev/null; then
    log WARNING "TypeScript not available"
  fi

  # Validate turbo.json
  if [[ -f "turbo.json" ]]; then
    node -e "JSON.parse(require('fs').readFileSync('turbo.json', 'utf8'))" 2>/dev/null || {
      log ERROR "turbo.json is invalid"
      validation_passed=false
    }
  fi

  if [[ "$validation_passed" == "true" ]]; then
    log SUCCESS "Setup validation passed"
    return 0
  else
    log ERROR "Setup validation failed"
    return 1
  fi
}

# ============================================================================
# Cleanup
# ============================================================================

cleanup() {
  # Remove temporary files
  rm -f .dev-server-wrapper.sh

  # Compact logs if too large
  if [[ -f "$LOG_FILE" ]] && [[ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo 0) -gt 1048576 ]]; then
    mv "$LOG_FILE" "$LOG_FILE.$TIMESTAMP"
    touch "$LOG_FILE"
  fi
}

# ============================================================================
# Main
# ============================================================================

main() {
  echo ""
  echo -e "${BOLD}🚀 Portfolio Monorepo Development Setup${NC}"
  echo "========================================"
  echo ""

  # Start logging
  mkdir -p "$(dirname "$LOG_FILE")"
  echo "===== Setup started at $(date) =====" >> "$LOG_FILE"

  # Register cleanup
  trap cleanup EXIT

  # Run setup steps
  preflight_checks

  # Try Volta first (preferred for monorepos)
  if [[ "$IS_CI" != "true" ]]; then
    setup_volta || log INFO "Continuing without Volta..."
  fi

  setup_node
  setup_pnpm
  install_dependencies
  setup_environment
  build_packages
  setup_git_hooks

  # Start dev server if interactive
  if [[ "$IS_INTERACTIVE" == "true" ]] && [[ "$IS_CI" != "true" ]]; then
    echo ""
    if [[ -t 0 ]]; then
      read -p "Would you like to start the development server? (Y/n) " -n 1 -r
      echo ""
      if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        start_dev_server || true
      fi
    fi
  fi

  # Final validation
  validate_setup

  echo ""
  echo -e "${BOLD}${GREEN}✨ Setup complete!${NC}"
  echo ""
  echo "📚 Next steps:"
  echo "  • Run 'pnpm dev' to start the development server"
  echo "  • Run 'pnpm test' to run tests"
  echo "  • Run 'pnpm build' to build for production"
  echo ""
  echo "📝 Logs saved to: $LOG_FILE"
  echo ""

  return 0
}

# Run main function
main "$@"
```
