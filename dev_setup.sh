#!/usr/bin/env bash

# Portfolio Monorepo Development Environment Setup - IDEMPOTENT VERSION
# Safe to run multiple times without side effects
# Implements best practices from Vercel, Microsoft Rush, and Google monorepos
# Version: 1.1.0

set -euo pipefail

# Script version for tracking
SCRIPT_VERSION="1.1.0"

# ============================================================================
# Environment Variable Sanitization
# ============================================================================

# Function to sanitize a variable - removes dangerous characters
sanitize_var() {
  local var_name="$1"
  local var_value="${!var_name:-}"
  
  # Remove null bytes, newlines, and other control characters
  var_value="${var_value//[$'\0-\037']/}"
  
  # For paths, only allow safe characters
  if [[ "$var_name" =~ (PATH|HOME|DIR) ]]; then
    var_value="${var_value//[^a-zA-Z0-9:\/._-]/}"
  fi
  
  # Re-export the sanitized value
  export "$var_name"="$var_value"
}

# Sanitize critical environment variables
for var in PATH HOME TMPDIR PWD SHELL USER VOLTA_HOME SCRIPT_DIR PROJECT_ROOT; do
  if [[ -n "${!var:-}" ]]; then
    sanitize_var "$var"
  fi
done

# ============================================================================
# Configuration
# ============================================================================

# Version requirements (from package.json)
REQUIRED_NODE_VERSION="20.17.0"
REQUIRED_PNPM_VERSION="9.12.0"
NODE_VERSION_RANGE=">=20.17.0 <21.0.0"

# Volta configuration for automatic version management
VOLTA_VERSION="1.1.1"

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR" && pwd)"
LOG_DIR="$PROJECT_ROOT/.setup-logs"
LOG_FILE="$LOG_DIR/setup-$(date +%Y%m%d).log"  # Daily rotation
PID_FILE="$PROJECT_ROOT/.dev-server.pid"
LOCK_FILE="$PROJECT_ROOT/.setup.lock"
LOCK_TIMEOUT=300  # 5 minutes
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
MAX_LOG_SIZE=10485760  # 10MB
MAX_LOG_AGE_DAYS=7

# Environment detection
INTERACTIVE=true
CI_ENVIRONMENT=false
CI_PLATFORM="local"
CONTAINER_ENVIRONMENT=false

detect_environment() {
  # Detect CI environment
  if [[ "${CI:-false}" == "true" ]] || \
     [[ -n "${GITHUB_ACTIONS:-}" ]] || \
     [[ -n "${GITLAB_CI:-}" ]] || \
     [[ -n "${CIRCLECI:-}" ]] || \
     [[ -n "${JENKINS_URL:-}" ]] || \
     [[ -n "${BUILDKITE:-}" ]] || \
     [[ -n "${DRONE:-}" ]] || \
     [[ -n "${TRAVIS:-}" ]] || \
     [[ -n "${CODEBUILD_BUILD_ID:-}" ]] || \
     [[ -n "${AZURE_PIPELINES:-}" ]]; then
    INTERACTIVE=false
    CI_ENVIRONMENT=true
    
    # Detect specific CI platform
    if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
      CI_PLATFORM="github-actions"
    elif [[ -n "${GITLAB_CI:-}" ]]; then
      CI_PLATFORM="gitlab"
    elif [[ -n "${CIRCLECI:-}" ]]; then
      CI_PLATFORM="circleci"
    elif [[ -n "${JENKINS_URL:-}" ]]; then
      CI_PLATFORM="jenkins"
    elif [[ -n "${BUILDKITE:-}" ]]; then
      CI_PLATFORM="buildkite"
    elif [[ -n "${DRONE:-}" ]]; then
      CI_PLATFORM="drone"
    elif [[ -n "${TRAVIS:-}" ]]; then
      CI_PLATFORM="travis"
    elif [[ -n "${CODEBUILD_BUILD_ID:-}" ]]; then
      CI_PLATFORM="aws-codebuild"
    elif [[ -n "${AZURE_PIPELINES:-}" ]]; then
      CI_PLATFORM="azure-pipelines"
    else
      CI_PLATFORM="generic"
    fi
  else
    INTERACTIVE=true
    CI_ENVIRONMENT=false
    CI_PLATFORM="local"
  fi
  
  # Detect container environment
  if [[ -f /.dockerenv ]] || grep -q 'docker\|lxc\|containerd' /proc/1/cgroup 2>/dev/null; then
    CONTAINER_ENVIRONMENT=true
    
    # Container-specific adjustments
    log INFO "Running in container environment"
    
    # Disable interactive prompts in containers
    INTERACTIVE=false
    
    # Disable color if not explicitly forced
    if [[ -z "${FORCE_COLOR:-}" ]]; then
      export FORCE_COLOR=0
      RED=""
      GREEN=""
      YELLOW=""
      BLUE=""
      MAGENTA=""
      CYAN=""
      BOLD=""
      NC=""
    fi
    
    # Set flag to skip browser opening
    SKIP_BROWSER_OPEN=true
  else
    CONTAINER_ENVIRONMENT=false
    SKIP_BROWSER_OPEN=false
  fi
  
  # Non-interactive if not a terminal
  if [[ ! -t 1 ]]; then
    INTERACTIVE=false
  fi
}

# Detect environment immediately
detect_environment

# CI-specific logging functions
log_ci() {
  local level="$1"
  shift
  local message="$*"
  
  case "$CI_PLATFORM" in
    github-actions)
      case "$level" in
        error)  echo "::error::$message" ;;
        warning) echo "::warning::$message" ;;
        notice) echo "::notice::$message" ;;
        group)  echo "::group::$message" ;;
        endgroup) echo "::endgroup::" ;;
        *)      echo "$message" ;;
      esac
      ;;
    gitlab)
      case "$level" in
        error)  echo -e "\e[31mERROR: $message\e[0m" ;;
        warning) echo -e "\e[33mWARN: $message\e[0m" ;;
        *)      echo "$message" ;;
      esac
      ;;
    *)
      echo "[$level] $message"
      ;;
  esac
}

# Backward compatibility
IS_CI="$CI_ENVIRONMENT"
IS_GITHUB_ACTIONS="false"
if [[ "$CI_PLATFORM" == "github-actions" ]]; then
  IS_GITHUB_ACTIONS="true"
fi
IS_INTERACTIVE="$INTERACTIVE"

# Platform detection
PLATFORM=""
ARCH=""
IS_WSL=false

detect_platform() {
  case "$(uname -s)" in
    Darwin*)    
      PLATFORM="macos"
      # Detect Apple Silicon
      if [[ "$(uname -m)" == "arm64" ]]; then
        ARCH="arm64"
      else
        ARCH="x86_64"
      fi
      ;;
    Linux*)     
      if [[ -n "${WSL_DISTRO_NAME:-}" ]] || grep -qi microsoft /proc/version 2>/dev/null; then
        PLATFORM="wsl"
        IS_WSL=true
      else
        PLATFORM="linux"
      fi
      ARCH="$(uname -m)"
      ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*) 
      echo "❌ ERROR: Native Windows detected. This script requires WSL2 or a Unix-like environment."
      echo "📚 Please install WSL2: https://docs.microsoft.com/en-us/windows/wsl/install"
      echo ""
      echo "After installing WSL2, run this script from within your WSL2 terminal."
      exit 1
      ;;
    *)          
      echo "❌ ERROR: Unknown platform detected: $(uname -s)"
      echo "Supported platforms: macOS, Linux, WSL2"
      exit 1
      ;;
  esac
}

# Detect platform immediately
detect_platform

# Colors for output (disabled in CI or non-interactive)
if [[ "$CI_ENVIRONMENT" == "true" ]] || [[ "$INTERACTIVE" == "false" ]]; then
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
# Lock File Management (Prevent Concurrent Runs)
# ============================================================================

acquire_lock() {
  local lock_dir="${LOCK_FILE}.lock"
  local timeout="${LOCK_TIMEOUT:-300}"
  local waited=0
  
  # Atomic directory creation
  while ! mkdir "$lock_dir" 2>/dev/null; do
    if [[ $waited -ge $timeout ]]; then
      # Check if lock is stale
      if [[ -f "$lock_dir/pid" ]]; then
        local pid=$(cat "$lock_dir/pid" 2>/dev/null || echo "")
        if [[ -n "$pid" ]] && ! kill -0 "$pid" 2>/dev/null; then
          log WARNING "Removing stale lock (PID $pid no longer exists)"
          rm -rf "$lock_dir"
          continue
        fi
      fi
      log ERROR "Failed to acquire lock after ${timeout}s"
      log INFO "Another instance may be running. If not, remove: $lock_dir"
      exit 1
    fi
    
    if [[ $((waited % 10)) -eq 0 ]]; then
      log INFO "Waiting for lock... (${waited}s elapsed)"
    fi
    
    sleep 1
    ((waited++))
  done
  
  # Store PID and timestamp for stale lock detection
  echo $$ > "$lock_dir/pid"
  echo "$(date -Iseconds)" > "$lock_dir/timestamp"
  log DEBUG "Lock acquired by PID $$"
}

release_lock() {
  local lock_dir="${LOCK_FILE}.lock"
  if [[ -d "$lock_dir" ]]; then
    rm -rf "$lock_dir"
    log DEBUG "Lock released by PID $$"
  fi
}

# Ensure lock is released on exit
trap release_lock EXIT

# ============================================================================
# Signal Handling and Cleanup
# ============================================================================

# Track child processes for cleanup
CHILD_PIDS=()

# Register a child process for tracking
register_child_process() {
  local pid="$1"
  CHILD_PIDS+=("$pid")
  log DEBUG "Registered child process: $pid"
}

# Kill all child processes gracefully
kill_child_processes() {
  if [[ ${#CHILD_PIDS[@]} -eq 0 ]]; then
    return
  fi
  
  log INFO "Terminating ${#CHILD_PIDS[@]} child process(es)..."
  
  # First try SIGTERM for graceful shutdown
  for pid in "${CHILD_PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      log DEBUG "Sending SIGTERM to process $pid"
      kill -TERM "$pid" 2>/dev/null || true
    fi
  done
  
  # Give processes time to terminate
  local wait_time=0
  local all_terminated=false
  while [[ $wait_time -lt 5 ]]; do
    all_terminated=true
    for pid in "${CHILD_PIDS[@]}"; do
      if kill -0 "$pid" 2>/dev/null; then
        all_terminated=false
        break
      fi
    done
    
    if [[ "$all_terminated" == "true" ]]; then
      break
    fi
    
    sleep 0.5
    ((wait_time++))
  done
  
  # Force kill any remaining processes
  if [[ "$all_terminated" == "false" ]]; then
    for pid in "${CHILD_PIDS[@]}"; do
      if kill -0 "$pid" 2>/dev/null; then
        log WARNING "Force killing process $pid"
        kill -KILL "$pid" 2>/dev/null || true
      fi
    done
  fi
  
  CHILD_PIDS=()
}

# Cleanup function for signal handling
cleanup_on_signal() {
  local signal="$1"
  log WARNING "Received signal: $signal"
  
  # Stop any running dev server
  if [[ -f "$PID_FILE" ]]; then
    local dev_pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
    if [[ -n "$dev_pid" ]] && kill -0 "$dev_pid" 2>/dev/null; then
      log INFO "Stopping dev server (PID: $dev_pid)..."
      kill_process_safely "$dev_pid"
      rm -f "$PID_FILE"
    fi
  fi
  
  # Kill all tracked child processes
  kill_child_processes
  
  # Remove temporary files
  rm -f .dev-server-wrapper.sh 2>/dev/null || true
  rm -f stop-dev-server.sh 2>/dev/null || true
  
  # Release lock file
  release_lock
  
  # Log final message
  log INFO "Cleanup completed for signal $signal"
  
  # Exit with appropriate code (128 + signal number)
  case "$signal" in
    INT)  exit $((128 + 2)) ;;   # SIGINT = 2
    TERM) exit $((128 + 15)) ;;  # SIGTERM = 15
    HUP)  exit $((128 + 1)) ;;   # SIGHUP = 1
    *)    exit 1 ;;
  esac
}

# Set up signal handlers
trap 'cleanup_on_signal INT' INT
trap 'cleanup_on_signal TERM' TERM
trap 'cleanup_on_signal HUP' HUP

# ============================================================================
# Log Management (Rotation and Cleanup)
# ============================================================================

setup_logging() {
  # Sanitize log directory path
  LOG_DIR="${LOG_DIR//[^a-zA-Z0-9\/_.-]/}"
  
  # Create log directory
  mkdir -p "$LOG_DIR"
  
  # Rotate old logs
  find "$LOG_DIR" -name "setup-*.log" -type f -mtime +$MAX_LOG_AGE_DAYS -delete 2>/dev/null || true
  
  # Rotate current log if too large
  if [[ -f "$LOG_FILE" ]] && [[ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo 0) -gt $MAX_LOG_SIZE ]]; then
    mv "$LOG_FILE" "$LOG_FILE.$TIMESTAMP"
    gzip "$LOG_FILE.$TIMESTAMP" 2>/dev/null || true
  fi
  
  # Start new log session
  echo "" >> "$LOG_FILE"
  echo "===== Setup started at $(date) by PID $$ =====" >> "$LOG_FILE"
}

# Redact sensitive information from log messages
redact_sensitive() {
  local message="$1"
  
  # Redact API keys (various formats)
  message=$(echo "$message" | sed -E 's/([A-Za-z0-9_-]{20,})/[REDACTED-KEY]/g')
  
  # Redact tokens
  message=$(echo "$message" | sed -E 's/(token[[:space:]]*[:=][[:space:]]*[^[:space:]]+)/[REDACTED-TOKEN]/gi')
  
  # Redact passwords
  message=$(echo "$message" | sed -E 's/(password[[:space:]]*[:=][[:space:]]*[^[:space:]]+)/[REDACTED-PASS]/gi')
  
  # Redact authorization headers
  message=$(echo "$message" | sed -E 's/(authorization[[:space:]]*[:=][[:space:]]*[^[:space:]]+)/[REDACTED-AUTH]/gi')
  
  # Redact common secret patterns
  message=$(echo "$message" | sed -E 's/(secret[[:space:]]*[:=][[:space:]]*[^[:space:]]+)/[REDACTED-SECRET]/gi')
  
  # Redact SSH keys
  message=$(echo "$message" | sed -E 's/(-----BEGIN[^-]+-----[^-]+-----END[^-]+-----)/[REDACTED-SSH-KEY]/g')
  
  echo "$message"
}

log() {
  local level=$1
  shift
  local message="$*"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  
  # Redact sensitive information
  local safe_message=$(redact_sensitive "$message")
  
  # Log to file (with redaction)
  echo "[$timestamp] [$level] $safe_message" >> "$LOG_FILE"
  
  # Log to console with colors (original message for local display)
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

# ============================================================================
# Utility Functions
# ============================================================================

command_exists() {
  command -v "$1" &> /dev/null
}

# Validate a path - ensure it doesn't contain dangerous patterns
validate_path() {
  local path="$1"
  local path_type="${2:-generic}"  # generic, directory, file
  
  # Check for null bytes
  if [[ "$path" =~ $'\0' ]]; then
    log ERROR "Invalid path: contains null bytes"
    return 1
  fi
  
  # Check for path traversal attempts
  if [[ "$path" =~ \.\. ]]; then
    log ERROR "Invalid path: potential directory traversal"
    return 1
  fi
  
  # Ensure path doesn't contain shell metacharacters
  if [[ "$path" =~ [\;\|\&\<\>\$\(\)\{\}\[\]\*\?] ]]; then
    log ERROR "Invalid path: contains shell metacharacters"
    return 1
  fi
  
  # Additional checks for directory paths
  if [[ "$path_type" == "directory" ]] && [[ -e "$path" ]] && [[ ! -d "$path" ]]; then
    log ERROR "Invalid path: exists but is not a directory"
    return 1
  fi
  
  return 0
}

# Validate a URL - ensure it's a proper HTTPS URL
validate_url() {
  local url="$1"
  
  # Must start with https://
  if [[ ! "$url" =~ ^https:// ]]; then
    log ERROR "Invalid URL: must use HTTPS"
    return 1
  fi
  
  # Check for valid domain pattern
  if [[ ! "$url" =~ ^https://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,} ]]; then
    log ERROR "Invalid URL: malformed domain"
    return 1
  fi
  
  # Ensure no shell metacharacters in the path/query part
  if [[ "$url" =~ [\;\|\&\<\>\$\(\)\{\}\[\]\'] ]]; then
    log ERROR "Invalid URL: contains dangerous characters"
    return 1
  fi
  
  return 0
}

get_node_version() {
  if command_exists node; then
    node -v | sed 's/v//'
  else
    echo "0.0.0"
  fi
}

get_pnpm_version() {
  if command_exists pnpm; then
    pnpm -v 2>/dev/null || echo "0.0.0"
  else
    echo "0.0.0"
  fi
}

# Download a file with retry logic and exponential backoff
download_with_retry() {
  local url="$1"
  local output="$2"
  local max_attempts="${3:-3}"
  local timeout="${4:-30}"
  local attempt=1
  local delay=2
  
  log DEBUG "Downloading from $url to $output (max attempts: $max_attempts, timeout: ${timeout}s)"
  
  while [[ $attempt -le $max_attempts ]]; do
    log DEBUG "Download attempt $attempt of $max_attempts"
    
    # Try download with appropriate tool
    local download_success=false
    
    if command_exists curl; then
      if curl --silent --show-error --location \
              --connect-timeout "$timeout" \
              --max-time "$((timeout * 2))" \
              --retry 0 \
              --output "$output" \
              "$url" 2>&1 | tee -a "$LOG_FILE"; then
        download_success=true
      fi
    elif command_exists wget; then
      if wget --quiet --no-verbose \
              --timeout="$timeout" \
              --tries=1 \
              --output-document="$output" \
              "$url" 2>&1 | tee -a "$LOG_FILE"; then
        download_success=true
      fi
    else
      log ERROR "Neither curl nor wget is available"
      return 1
    fi
    
    # Check if download succeeded
    if [[ "$download_success" == "true" ]] && [[ -s "$output" ]]; then
      log DEBUG "Download successful"
      return 0
    fi
    
    # Download failed
    if [[ $attempt -lt $max_attempts ]]; then
      log WARNING "Download failed, retrying in ${delay}s..."
      sleep "$delay"
      # Exponential backoff: 2s, 4s, 8s
      delay=$((delay * 2))
      if [[ $delay -gt 8 ]]; then
        delay=8
      fi
    else
      log ERROR "Download failed after $max_attempts attempts"
      rm -f "$output" 2>/dev/null || true
      return 1
    fi
    
    ((attempt++))
  done
  
  return 1
}

# Execute a command with retry logic (useful for pnpm install)
execute_with_retry() {
  local cmd="$1"
  local description="$2"
  local max_attempts="${3:-3}"
  local attempt=1
  local delay=2
  
  log DEBUG "Executing: $description (max attempts: $max_attempts)"
  
  while [[ $attempt -le $max_attempts ]]; do
    log DEBUG "Execution attempt $attempt of $max_attempts"
    
    # Try to execute the command
    if eval "$cmd"; then
      log DEBUG "Command executed successfully"
      return 0
    fi
    
    # Command failed
    local exit_code=$?
    
    if [[ $attempt -lt $max_attempts ]]; then
      log WARNING "Command failed with exit code $exit_code, retrying in ${delay}s..."
      sleep "$delay"
      # Exponential backoff: 2s, 4s, 8s
      delay=$((delay * 2))
      if [[ $delay -gt 8 ]]; then
        delay=8
      fi
    else
      log ERROR "Command failed after $max_attempts attempts"
      return $exit_code
    fi
    
    ((attempt++))
  done
  
  return 1
}

# ============================================================================
# Cleanup Functions
# ============================================================================

cleanup_old_files() {
  log INFO "Cleaning up old files..."
  
  # Clean up old server logs (keep last 10)
  if [[ -d "logs" ]]; then
    ls -t logs/dev-server-*.log 2>/dev/null | tail -n +11 | xargs -r rm -f
  fi
  
  # Remove orphaned temporary files
  rm -f .dev-server-wrapper.sh.old 2>/dev/null || true
  
  # Clean up old PID files if process doesn't exist
  if [[ -f "$PID_FILE" ]]; then
    local old_pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
    if [[ -n "$old_pid" ]] && ! kill -0 "$old_pid" 2>/dev/null; then
      rm -f "$PID_FILE"
      log DEBUG "Removed stale PID file"
    fi
  fi
}

# ============================================================================
# Pre-flight Checks
# ============================================================================

preflight_checks() {
  log INFO "Running pre-flight checks..."
  
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
  
  # Check for conflicting Node.js version managers
  local conflicting_managers=()
  local uninstall_commands=()
  
  # Check for nvm
  if [[ -n "${NVM_DIR:-}" ]] || command_exists nvm || [[ -f "$HOME/.nvm/nvm.sh" ]]; then
    conflicting_managers+=("nvm")
    uninstall_commands+=("  - nvm: rm -rf ~/.nvm && sed -i '/NVM_DIR/d;/nvm.sh/d' ~/.bashrc ~/.zshrc")
  fi
  
  # Check for fnm (can be installed in multiple locations)
  local fnm_dirs=(
    "$HOME/.fnm"
    "${XDG_DATA_HOME:-$HOME/.local/share}/fnm"
    "$HOME/Library/Application Support/fnm"  # macOS
  )
  local fnm_found=false
  for dir in "${fnm_dirs[@]}"; do
    if [[ -d "$dir" ]]; then
      fnm_found=true
      break
    fi
  done
  
  if command_exists fnm || [[ "$fnm_found" == "true" ]] || [[ -n "${FNM_PATH:-}" ]]; then
    conflicting_managers+=("fnm")
    # Note: fnm can be installed in different locations depending on version and OS
    uninstall_commands+=("  - fnm: rm -rf ~/.fnm ~/.local/share/fnm ~/Library/Application\\ Support/fnm && sed -i '/# fnm/,/^fi/d;/FNM_PATH/d;/fnm env/d' ~/.bashrc ~/.zshrc ~/.config/fish/config.fish 2>/dev/null")
  fi
  
  # Check for n
  if command_exists n; then
    conflicting_managers+=("n")
    uninstall_commands+=("  - n: npm uninstall -g n")
  fi
  
  # Check for asdf with nodejs plugin
  if command_exists asdf && asdf list nodejs &>/dev/null 2>&1; then
    conflicting_managers+=("asdf (nodejs plugin)")
    uninstall_commands+=("  - asdf: asdf uninstall nodejs && asdf plugin remove nodejs")
  fi
  
  # Check for nodenv
  if command_exists nodenv || [[ -d "$HOME/.nodenv" ]]; then
    conflicting_managers+=("nodenv")
    uninstall_commands+=("  - nodenv: rm -rf ~/.nodenv && sed -i '/nodenv/d' ~/.bashrc ~/.zshrc")
  fi
  
  # If conflicting managers found, fail with instructions
  if [[ ${#conflicting_managers[@]} -gt 0 ]]; then
    log ERROR "Conflicting Node.js version managers detected: ${conflicting_managers[*]}"
    log ERROR "Volta cannot be installed alongside other Node.js version managers."
    log INFO ""
    log INFO "Please uninstall the following before running this setup:"
    for cmd in "${uninstall_commands[@]}"; do
      log INFO "$cmd"
    done
    log INFO ""
    log INFO "After uninstalling, restart your shell and run this setup again."
    exit 1
  fi
  
  # Check if we're in a git repository
  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log WARNING "Not in a git repository. Some features may not work correctly."
  fi
  
  # Check system resources
  check_system_resources
  
  log SUCCESS "Pre-flight checks passed"
}

# Check system resources (disk, memory, permissions)
check_system_resources() {
  log INFO "Checking system resources..."
  
  # Check disk space
  check_disk_space
  
  # Check available memory
  check_memory
  
  # Check file system permissions
  check_filesystem_permissions
}

# Check available disk space
check_disk_space() {
  local required_space_mb=1024  # 1GB in MB
  local available_space_mb=0
  
  # Get available disk space in MB (cross-platform)
  if [[ "$PLATFORM" == "macos" ]]; then
    # macOS uses different df syntax
    available_space_mb=$(df -m "$PROJECT_ROOT" | awk 'NR==2 {print $4}')
  else
    # Linux/WSL
    available_space_mb=$(df -BM "$PROJECT_ROOT" | awk 'NR==2 {gsub(/M/, "", $4); print $4}')
  fi
  
  # Check if we could get the disk space
  if [[ -z "$available_space_mb" ]] || ! [[ "$available_space_mb" =~ ^[0-9]+$ ]]; then
    log WARNING "Could not determine available disk space"
    return
  fi
  
  # Convert to integer for comparison
  available_space_mb=$((available_space_mb))
  
  if [[ $available_space_mb -lt $required_space_mb ]]; then
    log ERROR "Insufficient disk space: ${available_space_mb}MB available, ${required_space_mb}MB required"
    log INFO "Please free up disk space and try again"
    exit 1
  else
    log DEBUG "Disk space check passed: ${available_space_mb}MB available"
  fi
}

# Check available memory
check_memory() {
  local required_memory_mb=512
  local available_memory_mb=0
  
  # Get available memory (cross-platform)
  if [[ "$PLATFORM" == "macos" ]]; then
    # macOS: use vm_stat
    local page_size=$(vm_stat | grep "page size" | awk '{print $8}')
    local free_pages=$(vm_stat | grep "Pages free" | awk '{print $3}' | sed 's/\.//')
    local inactive_pages=$(vm_stat | grep "Pages inactive" | awk '{print $3}' | sed 's/\.//')
    
    if [[ -n "$page_size" ]] && [[ -n "$free_pages" ]]; then
      # Calculate available memory in MB
      available_memory_mb=$(( (free_pages + inactive_pages) * page_size / 1024 / 1024 ))
    fi
  else
    # Linux/WSL: use /proc/meminfo
    if [[ -f /proc/meminfo ]]; then
      # Get MemAvailable if present (kernel 3.14+), otherwise calculate from MemFree + Buffers + Cached
      local mem_available=$(grep -E "^MemAvailable:" /proc/meminfo | awk '{print $2}')
      
      if [[ -n "$mem_available" ]]; then
        available_memory_mb=$((mem_available / 1024))
      else
        # Fallback for older kernels
        local mem_free=$(grep -E "^MemFree:" /proc/meminfo | awk '{print $2}')
        local buffers=$(grep -E "^Buffers:" /proc/meminfo | awk '{print $2}')
        local cached=$(grep -E "^Cached:" /proc/meminfo | awk '{print $2}')
        
        if [[ -n "$mem_free" ]]; then
          available_memory_mb=$(( (mem_free + buffers + cached) / 1024 ))
        fi
      fi
    fi
  fi
  
  # Check if we're in a container with memory limits
  if [[ "$CONTAINER_ENVIRONMENT" == "true" ]]; then
    # Check cgroup memory limits
    local cgroup_limit_file="/sys/fs/cgroup/memory/memory.limit_in_bytes"
    if [[ -f "$cgroup_limit_file" ]]; then
      local cgroup_limit=$(cat "$cgroup_limit_file" 2>/dev/null)
      if [[ -n "$cgroup_limit" ]] && [[ "$cgroup_limit" -lt 9223372036854775807 ]]; then
        # Convert to MB and use the lower of cgroup limit or system memory
        local cgroup_limit_mb=$((cgroup_limit / 1024 / 1024))
        if [[ $cgroup_limit_mb -lt $available_memory_mb ]]; then
          available_memory_mb=$cgroup_limit_mb
          log DEBUG "Container memory limit detected: ${cgroup_limit_mb}MB"
        fi
      fi
    fi
  fi
  
  # Check if we could determine memory
  if [[ $available_memory_mb -eq 0 ]]; then
    log WARNING "Could not determine available memory"
    return
  fi
  
  # Check against requirement
  if [[ $available_memory_mb -lt $required_memory_mb ]]; then
    log WARNING "Low memory: ${available_memory_mb}MB available, ${required_memory_mb}MB recommended"
    log INFO "Setup may run slowly or fail. Consider closing other applications."
    
    # Don't fail, just warn
    if [[ "$CI_ENVIRONMENT" == "true" ]]; then
      log INFO "Continuing despite low memory (CI environment)"
    fi
  else
    log DEBUG "Memory check passed: ${available_memory_mb}MB available"
  fi
}

# Check file system permissions
check_filesystem_permissions() {
  log DEBUG "Checking file system permissions..."
  
  # Test write permission in project root
  local test_file="$PROJECT_ROOT/.setup-permission-test-$$"
  if ! touch "$test_file" 2>/dev/null; then
    log ERROR "No write permission in project directory: $PROJECT_ROOT"
    exit 1
  fi
  rm -f "$test_file"
  
  # Test temp directory access
  local temp_test=$(mktemp 2>/dev/null)
  if [[ -z "$temp_test" ]]; then
    log ERROR "Cannot create temporary files. Check TMPDIR permissions."
    exit 1
  fi
  rm -f "$temp_test"
  
  # Test symlink capability (important for node_modules)
  if [[ "$PLATFORM" != "wsl" ]]; then  # WSL may have issues with symlinks
    local test_symlink="$PROJECT_ROOT/.setup-symlink-test-$$"
    if ln -s "$test_file" "$test_symlink" 2>/dev/null; then
      rm -f "$test_symlink"
      log DEBUG "Symlink support verified"
    else
      log WARNING "Cannot create symlinks. Some npm packages may not work correctly."
    fi
  fi
  
  log DEBUG "File system permission checks passed"
}

# ============================================================================
# Volta Setup (Idempotent)
# ============================================================================

setup_volta() {
  log INFO "Checking Volta installation..."
  
  # Warn about Volta in containers
  if [[ "$CONTAINER_ENVIRONMENT" == "true" ]]; then
    log WARNING "Volta may not persist across container restarts"
    log INFO "Consider using a Dockerfile with pre-installed dependencies"
  fi
  
  # Ensure Volta is in PATH for this session first
  export VOLTA_HOME="${VOLTA_HOME:-$HOME/.volta}"
  export PATH="$VOLTA_HOME/bin:$PATH"
  
  local needs_install=false
  
  # Check if Volta binary exists (not just in PATH)
  if [[ -x "$VOLTA_HOME/bin/volta" ]]; then
    local installed_volta_version=$("$VOLTA_HOME/bin/volta" --version 2>/dev/null | cut -d' ' -f2)
    log INFO "Volta $installed_volta_version is already installed"
  else
    needs_install=true
  fi
  
  # Install Volta if needed
  if [[ "$needs_install" == "true" ]]; then
    log INFO "Installing Volta $VOLTA_VERSION..."
    
    # Create temp directory for secure download
    local temp_dir=$(mktemp -d)
    trap "rm -rf '$temp_dir'" EXIT
    
    # Download installer script for inspection
    local installer_script="$temp_dir/volta-install.sh"
    local volta_url="https://get.volta.sh"
    
    # Validate URL before downloading
    if ! validate_url "$volta_url"; then
      log ERROR "Invalid Volta installer URL"
      return 1
    fi
    
    # Use download_with_retry for resilient network operations
    if ! download_with_retry "$volta_url" "$installer_script"; then
      log ERROR "Failed to download Volta installer after multiple attempts"
      return 1
    fi
    
    # Verify script is not empty and has expected content
    if [[ ! -s "$installer_script" ]]; then
      log ERROR "Downloaded Volta installer is empty"
      return 1
    fi
    
    # Basic validation - check for known Volta installer patterns
    if ! grep -q "volta" "$installer_script" || ! grep -q "get.volta.sh" "$installer_script"; then
      log ERROR "Downloaded script doesn't appear to be the Volta installer"
      return 1
    fi
    
    # Execute the installer script with explicit bash
    bash "$installer_script" --skip-setup 2>&1 | tee -a "$LOG_FILE" || {
      log ERROR "Volta installation failed"
      return 1
    }
    
    # Clean up temp directory (trap will also handle this)
    rm -rf "$temp_dir"
  fi
  
  # Always ensure Volta is in shell profile (idempotent)
  # This needs to run even if Volta was already installed
  if [[ "$IS_CI" != "true" ]]; then
    local shell_profile=""
    if [[ -n "${BASH_VERSION:-}" ]]; then
      shell_profile="$HOME/.bashrc"
    elif [[ -n "${ZSH_VERSION:-}" ]]; then
      shell_profile="$HOME/.zshrc"
    fi
    
    if [[ -n "$shell_profile" ]] && [[ -f "$shell_profile" ]]; then
      # Check if Volta is already configured
      if ! grep -q "VOLTA_HOME" "$shell_profile"; then
        log INFO "Adding Volta to $shell_profile..."
        {
          echo ""
          echo "# Volta configuration (added by portfolio setup)"
          echo "export VOLTA_HOME=\"\$HOME/.volta\""
          echo "export PATH=\"\$VOLTA_HOME/bin:\$PATH\""
        } >> "$shell_profile"
      else
        log DEBUG "Volta already configured in $shell_profile"
      fi
    fi
  fi
  
  # Verify installation
  if ! command_exists volta; then
    log ERROR "Volta installation failed"
    return 1
  fi
  
  if [[ "$needs_install" == "true" ]]; then
    log SUCCESS "Volta installed successfully"
  fi
  
  return 0
}

# ============================================================================
# Node.js Setup (Idempotent)
# ============================================================================

setup_node() {
  log INFO "Checking Node.js installation..."
  
  local current_version=$(get_node_version)
  
  if [[ "$current_version" == "$REQUIRED_NODE_VERSION" ]]; then
    log SUCCESS "Node.js $REQUIRED_NODE_VERSION is already installed"
    return 0
  fi
  
  if [[ "$current_version" == "0.0.0" ]]; then
    log INFO "Node.js is not installed"
  else
    log INFO "Found Node.js $current_version (required: $REQUIRED_NODE_VERSION)"
  fi
  
  if command_exists volta; then
    log INFO "Installing Node.js $REQUIRED_NODE_VERSION via Volta..."
    volta install node@$REQUIRED_NODE_VERSION
    volta pin node@$REQUIRED_NODE_VERSION
  else
    log ERROR "Volta is required to install Node.js"
    exit 1
  fi
  
  # Verify correct version
  current_version=$(get_node_version)
  if [[ "$current_version" != "$REQUIRED_NODE_VERSION" ]]; then
    log ERROR "Failed to install Node.js $REQUIRED_NODE_VERSION (got $current_version)"
    exit 1
  fi
  
  log SUCCESS "Node.js $REQUIRED_NODE_VERSION is ready"
}

# ============================================================================
# pnpm Setup (Idempotent)
# ============================================================================

setup_pnpm() {
  log INFO "Checking pnpm installation..."
  
  local current_version=$(get_pnpm_version)
  
  if [[ "$current_version" == "$REQUIRED_PNPM_VERSION" ]]; then
    log SUCCESS "pnpm $REQUIRED_PNPM_VERSION is already installed"
    return 0
  fi
  
  if [[ "$current_version" == "0.0.0" ]]; then
    log INFO "pnpm is not installed"
  else
    log INFO "Found pnpm $current_version (required: $REQUIRED_PNPM_VERSION)"
  fi
  
  if command_exists volta; then
    log INFO "Installing pnpm $REQUIRED_PNPM_VERSION via Volta..."
    volta install pnpm@$REQUIRED_PNPM_VERSION
    volta pin pnpm@$REQUIRED_PNPM_VERSION
  else
    log ERROR "Volta is required to install pnpm"
    exit 1
  fi
  
  # Verify correct version
  current_version=$(get_pnpm_version)
  if [[ "$current_version" != "$REQUIRED_PNPM_VERSION" ]]; then
    log ERROR "Failed to install pnpm $REQUIRED_PNPM_VERSION (got $current_version)"
    exit 1
  fi
  
  log SUCCESS "pnpm $REQUIRED_PNPM_VERSION is ready"
}

# ============================================================================
# Dependencies Installation (Idempotent)
# ============================================================================

install_dependencies() {
  log INFO "Checking project dependencies..."
  
  # Check if node_modules exists and is valid
  if [[ -d "node_modules" ]] && [[ -f "pnpm-lock.yaml" ]]; then
    # Verify dependencies are up to date
    if pnpm install --frozen-lockfile --dry-run 2>&1 | grep -q "Nothing to install"; then
      log SUCCESS "Dependencies are already up to date"
      return 0
    fi
  fi
  
  log INFO "Installing project dependencies..."
  
  # Clean install in CI
  local install_cmd
  if [[ "$IS_CI" == "true" ]]; then
    install_cmd="pnpm install --frozen-lockfile --prefer-offline"
  else
    install_cmd="pnpm install"
  fi
  
  # Use retry logic for network operations
  if ! execute_with_retry "$install_cmd" "pnpm install"; then
    log ERROR "Failed to install dependencies after multiple attempts"
    # Try offline mode as fallback if available
    if pnpm store status &>/dev/null; then
      log INFO "Attempting offline installation from cache..."
      if execute_with_retry "pnpm install --offline" "pnpm install (offline)" 1; then
        log WARNING "Installed from cache (offline mode) - some packages may be outdated"
      else
        exit 1
      fi
    else
      exit 1
    fi
  fi
  
  log SUCCESS "Dependencies installed successfully"
}

# ============================================================================
# Environment Setup (Idempotent)
# ============================================================================

setup_environment() {
  log INFO "Setting up environment files..."
  
  local env_created=0
  local env_skipped=0
  
  # Root .env.local
  if [[ -f ".env.example" ]]; then
    if [[ -f ".env.local" ]]; then
      log DEBUG ".env.local already exists, skipping..."
      ((env_skipped++))
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
        ((env_skipped++))
      else
        cp "$app_dir/.env.example" "$app_dir/.env.local"
        log SUCCESS "Created $app_dir.env.local"
        ((env_created++))
      fi
    fi
  done
  
  log INFO "Environment setup: $env_created created, $env_skipped skipped"
}

# ============================================================================
# Build Shared Packages (Idempotent)
# ============================================================================

build_packages() {
  log INFO "Checking shared packages..."
  
  # Check if packages directory has any packages
  if [[ -d "packages" ]] && find packages -mindepth 1 -maxdepth 1 -type d | grep -q .; then
    log INFO "Building shared packages..."
    # Use retry logic for build command which may need to download dependencies
    if ! execute_with_retry "pnpm turbo run build --filter='./packages/*'" "build shared packages"; then
      log WARNING "Some packages failed to build (this may be expected for empty packages)"
    fi
  else
    log INFO "No shared packages to build"
  fi
}

# ============================================================================
# Git Hooks Setup (Idempotent)
# ============================================================================

setup_git_hooks() {
  if [[ "$IS_CI" == "true" ]]; then
    log DEBUG "Skipping git hooks setup in CI"
    return
  fi
  
  log INFO "Setting up git hooks..."
  
  if [[ -f "package.json" ]] && grep -q '"prepare".*husky' package.json; then
    # Check if hooks are already installed
    if [[ -d ".husky" ]] && [[ -f ".husky/_/husky.sh" ]]; then
      log DEBUG "Git hooks already installed"
    else
      if ! execute_with_retry "pnpm run prepare" "setup git hooks"; then
        log WARNING "Failed to setup git hooks"
      fi
    fi
  else
    log DEBUG "No git hooks configuration found"
  fi
}

# ============================================================================
# Development Server Management (Idempotent)
# ============================================================================

cleanup_old_processes() {
  if [[ -f "$PID_FILE" ]]; then
    local old_pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
    if [[ -n "$old_pid" ]]; then
      if kill -0 "$old_pid" 2>/dev/null; then
        log INFO "Found old dev server (PID: $old_pid)"
        kill_process_safely "$old_pid"
      fi
      rm -f "$PID_FILE"
    fi
  fi
}

find_process_by_port() {
  local port="$1"
  local pid=""
  
  # Try multiple methods in order of preference
  if command_exists lsof; then
    pid=$(lsof -ti :$port 2>/dev/null || true)
  elif command_exists ss; then
    # ss is more modern than netstat and available on most Linux systems
    pid=$(ss -tlnp 2>/dev/null | grep ":$port " | grep -oP 'pid=\K\d+' || true)
  elif command_exists netstat; then
    if [[ "$PLATFORM" == "macos" ]]; then
      # macOS netstat has different options
      pid=$(netstat -vanp tcp 2>/dev/null | grep "\\.$port " | awk '{print $9}')
    else
      # Linux netstat (requires root for -p)
      pid=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d/ -f1)
    fi
  fi
  
  echo "$pid"
}

check_port() {
  local port=$1
  local pid=$(find_process_by_port "$port")
  
  if [[ -n "$pid" ]]; then
    return 0  # Port is in use
  fi
  
  # Fallback: try to connect
  if timeout 1 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null; then
    return 0  # Port is in use
  fi
  
  return 1  # Port is free
}

kill_process_safely() {
  local pid="$1"
  local signal="${2:-TERM}"
  
  if [[ -z "$pid" ]] || ! kill -0 "$pid" 2>/dev/null; then
    return 0  # Process doesn't exist
  fi
  
  log INFO "Terminating process $pid with signal $signal..."
  kill -$signal "$pid" 2>/dev/null || true
  
  # Give process time to terminate gracefully
  local count=0
  while kill -0 "$pid" 2>/dev/null && [[ $count -lt 10 ]]; do
    sleep 0.5
    ((count++))
  done
  
  # Force kill if still running
  if kill -0 "$pid" 2>/dev/null; then
    log WARNING "Process $pid didn't terminate, using SIGKILL"
    kill -9 "$pid" 2>/dev/null || true
  fi
}

create_dev_server_wrapper() {
  # Create wrapper script (idempotent - always overwrite)
  cat > .dev-server-wrapper.sh << 'EOF'
#!/bin/bash
# Auto-generated wrapper for dev server
exec pnpm dev "$@"
EOF
  chmod +x .dev-server-wrapper.sh
}

create_stop_script() {
  local pid=$1
  
  # Always overwrite to ensure correct PID
  cat > stop-dev-server.sh << EOF
#!/bin/bash
# Auto-generated stop script for dev server
PID_FILE="$PID_FILE"

if [[ -f "\$PID_FILE" ]]; then
  PID=\$(cat "\$PID_FILE")
  if [[ "\$PID" == "$pid" ]] && kill -0 "\$PID" 2>/dev/null; then
    echo "Stopping dev server (PID: \$PID)..."
    kill -TERM "\$PID"
    sleep 2
    if kill -0 "\$PID" 2>/dev/null; then
      echo "Force stopping..."
      kill -KILL "\$PID"
    fi
    rm -f "\$PID_FILE"
    echo "✅ Dev server stopped"
  else
    echo "⚠️  Dev server with PID \$PID is not running"
    rm -f "\$PID_FILE"
  fi
else
  echo "⚠️  No PID file found"
fi

# Cleanup
rm -f .dev-server-wrapper.sh
rm -f stop-dev-server.sh
EOF
  chmod +x stop-dev-server.sh
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
  
  log INFO "Preparing development server..."
  
  # Check default port
  local dev_port=5173
  
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
  
  # Clean up old logs (keep last 10)
  ls -t logs/dev-server-*.log 2>/dev/null | tail -n +11 | xargs -r rm -f
  
  local server_log="logs/dev-server-$TIMESTAMP.log"
  
  # Create wrapper script
  create_dev_server_wrapper
  
  # Start server in background
  log INFO "Starting dev server on port $dev_port..."
  nohup ./.dev-server-wrapper.sh > "$server_log" 2>&1 &
  local server_pid=$!
  echo $server_pid > "$PID_FILE"
  
  # Register for cleanup on signal
  register_child_process $server_pid
  
  # Create stop script with current PID
  create_stop_script $server_pid
  
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
      log INFO "To stop: ./stop-dev-server.sh"
      
      # Try to open browser (unless in container)
      if [[ "$SKIP_BROWSER_OPEN" != "true" ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
          open "http://localhost:$dev_port" 2>/dev/null || true
        elif command_exists xdg-open; then
          xdg-open "http://localhost:$dev_port" 2>/dev/null || true
        fi
      fi
      
      return 0
    fi
    
    # Check if process died
    if ! kill -0 $server_pid 2>/dev/null; then
      log ERROR "Dev server process died unexpectedly"
      log INFO "Check the server log for errors:"
      tail -20 "$server_log"
      rm -f "$PID_FILE"
      return 1
    fi
    
    ((attempt++))
    sleep 1
  done
  
  log ERROR "Dev server failed to start within 30 seconds"
  log INFO "Check the server log: $server_log"
  tail -20 "$server_log"
  
  # Clean up
  kill -TERM $server_pid 2>/dev/null || true
  rm -f "$PID_FILE"
  return 1
}

# ============================================================================
# Validation (Idempotent)
# ============================================================================

create_healthcheck() {
  log DEBUG "Creating healthcheck file..."
  
  cat > .setup-health.json << EOF
{
  "setup_version": "$SCRIPT_VERSION",
  "setup_date": "$(date -Iseconds)",
  "node_version": "$(get_node_version)",
  "pnpm_version": "$(get_pnpm_version)",
  "platform": "$PLATFORM",
  "arch": "$ARCH",
  "is_wsl": $IS_WSL,
  "ci_environment": $CI_ENVIRONMENT,
  "ci_platform": "$CI_PLATFORM"
}
EOF
  
  log DEBUG "Healthcheck file created"
}

validate_setup() {
  log INFO "Validating setup..."
  
  local validation_passed=true
  local validation_errors=()
  
  # Check Node.js version
  local current_node=$(get_node_version)
  if [[ "$current_node" != "$REQUIRED_NODE_VERSION" ]]; then
    validation_errors+=("Node.js version mismatch: $current_node != $REQUIRED_NODE_VERSION")
    validation_passed=false
  fi
  
  # Check pnpm version
  local current_pnpm=$(get_pnpm_version)
  if [[ "$current_pnpm" != "$REQUIRED_PNPM_VERSION" ]]; then
    validation_errors+=("pnpm version mismatch: $current_pnpm != $REQUIRED_PNPM_VERSION")
    validation_passed=false
  fi
  
  # Check node_modules
  if [[ ! -d "node_modules" ]]; then
    validation_errors+=("node_modules directory not found")
    validation_passed=false
  fi
  
  # Check package.json volta config
  if [[ -f "package.json" ]] && ! grep -q '"volta"' package.json; then
    validation_errors+=("Volta configuration missing from package.json")
    validation_passed=false
  fi
  
  # Report results
  if [[ "$validation_passed" == "true" ]]; then
    log SUCCESS "All validations passed"
    return 0
  else
    log ERROR "Validation failed:"
    for error in "${validation_errors[@]}"; do
      log ERROR "  - $error"
    done
    return 1
  fi
}

# ============================================================================
# Main (Idempotent Entry Point)
# ============================================================================

main() {
  local start_time=$(date +%s)
  
  echo ""
  echo -e "${BOLD}🚀 Portfolio Monorepo Development Setup (Idempotent)${NC}"
  echo "===================================================="
  echo "Version: $SCRIPT_VERSION"
  echo ""
  
  # Acquire lock to prevent concurrent runs
  acquire_lock
  
  # Set up logging with rotation
  setup_logging
  
  log INFO "Running setup script version $SCRIPT_VERSION"
  
  # Clean up old files first
  cleanup_old_files
  
  # Run setup steps
  preflight_checks
  
  # Volta is mandatory
  setup_volta || {
    log ERROR "Volta setup failed - this is required"
    exit 1
  }
  
  setup_node
  setup_pnpm
  install_dependencies
  setup_environment
  build_packages
  setup_git_hooks
  
  # Validate everything is correct
  if ! validate_setup; then
    log ERROR "Setup validation failed. Please check the errors above."
    exit 1
  fi
  
  # Create healthcheck file for monitoring
  create_healthcheck
  
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
  
  echo ""
  echo -e "${BOLD}${GREEN}✨ Setup complete!${NC}"
  echo ""
  echo "📚 Next steps:"
  echo "  • Run 'pnpm dev' to start the development server"
  echo "  • Run 'pnpm test' to run tests"
  echo "  • Run 'pnpm build' to build for production"
  echo ""
  echo "📝 Logs: $LOG_FILE"
  echo ""
  
  # Calculate and display execution time
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))
  log SUCCESS "Setup completed in ${duration}s"
  
  return 0
}

# Run main function
main "$@"