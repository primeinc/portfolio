# Portfolio Monorepo Development Environment Setup Script

## Executive Summary

Your Portfolio Monorepo Development Environment Setup script demonstrates solid foundational practices including idempotent design, comprehensive logging, and platform detection. However, critical improvements are needed for production readiness, particularly in cross-platform compatibility, CI/CD support, and security hardening. This analysis identifies specific vulnerabilities and provides actionable fixes to transform your draft script into a robust, production-ready solution.

## Critical Issues Requiring Immediate Attention

### 1. Windows Native Block Implementation Vulnerability

Your current Windows detection likely uses simple pattern matching that can be bypassed. Here's a more robust implementation:

```bash
detect_platform() {
    case "$(uname -s)" in
        Darwin*)
            platform="macos"
            # Detect Apple Silicon
            if [[ "$(uname -m)" == "arm64" ]]; then
                arch="arm64"
            else
                arch="x86_64"
            fi
            ;;
        Linux*)
            if [[ -n "${WSL_DISTRO_NAME:-}" ]] || grep -qi microsoft /proc/version 2>/dev/null; then
                platform="wsl"
            else
                platform="linux"
            fi
            ;;
        CYGWIN*|MINGW32*|MSYS*|MINGW*)
            echo "ERROR: Native Windows detected. This script requires WSL or a Unix-like environment."
            echo "Please install WSL2 and run this script from within WSL."
            exit 1
            ;;
        *)
            echo "ERROR: Unknown platform detected: $(uname -s)"
            exit 1
            ;;
    esac
}
```

### 2. Lock File Race Condition

Your lock file implementation likely has a race condition window. Implement atomic locking:

```bash
acquire_lock() {
    local lock_file="$1"
    local timeout="${2:-300}"
    local lock_dir="${lock_file}.lock"
    local waited=0

    # Atomic directory creation
    while ! mkdir "$lock_dir" 2>/dev/null; do
        if [[ $waited -ge $timeout ]]; then
            # Check if lock is stale
            if [[ -f "$lock_dir/pid" ]]; then
                local pid=$(cat "$lock_dir/pid" 2>/dev/null || echo "")
                if [[ -n "$pid" ]] && ! kill -0 "$pid" 2>/dev/null; then
                    echo "Removing stale lock (PID $pid no longer exists)"
                    rm -rf "$lock_dir"
                    continue
                fi
            fi
            echo "ERROR: Failed to acquire lock after ${timeout}s"
            return 1
        fi
        sleep 1
        ((waited++))
    done

    # Store PID for stale lock detection
    echo $$ > "$lock_dir/pid"
    echo "$(date -Iseconds)" > "$lock_dir/timestamp"

    # Ensure cleanup on exit
    trap "rm -rf '$lock_dir'" EXIT
}
```

### 3. Port Detection Command Failures

The `lsof` and `netstat` commands have different availability across platforms. Implement fallback mechanisms:

```bash
find_process_by_port() {
    local port="$1"
    local pid=""

    # Try multiple methods in order of preference
    if command -v lsof >/dev/null 2>&1; then
        pid=$(lsof -ti :$port 2>/dev/null || true)
    elif command -v ss >/dev/null 2>&1; then
        pid=$(ss -tlnp 2>/dev/null | grep ":$port " | awk -F'pid=' '{print $2}' | cut -d, -f1)
    elif command -v netstat >/dev/null 2>&1; then
        if [[ "$platform" == "macos" ]]; then
            pid=$(netstat -vanp tcp 2>/dev/null | grep "\\.$port " | awk '{print $9}')
        else
            pid=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d/ -f1)
        fi
    fi

    echo "$pid"
}

kill_process_safely() {
    local pid="$1"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
        echo "Terminating process $pid..."
        kill "$pid" 2>/dev/null || true

        # Give process time to terminate gracefully
        local count=0
        while kill -0 "$pid" 2>/dev/null && [[ $count -lt 10 ]]; do
            sleep 0.5
            ((count++))
        done

        # Force kill if still running
        if kill -0 "$pid" 2>/dev/null; then
            kill -9 "$pid" 2>/dev/null || true
        fi
    fi
}
```

## CI/CD Environment Compatibility

### 4. Non-Interactive Mode Detection

Implement comprehensive CI detection:

```bash
detect_environment() {
    # Detect CI environment
    if [[ "${CI:-false}" == "true" ]] || \
       [[ -n "${GITHUB_ACTIONS:-}" ]] || \
       [[ -n "${GITLAB_CI:-}" ]] || \
       [[ -n "${CIRCLECI:-}" ]] || \
       [[ -n "${JENKINS_URL:-}" ]] || \
       [[ -n "${BUILDKITE:-}" ]] || \
       [[ -n "${DRONE:-}" ]]; then
        INTERACTIVE=false
        CI_ENVIRONMENT=true

        # Detect specific CI platform
        if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
            CI_PLATFORM="github-actions"
        elif [[ -n "${GITLAB_CI:-}" ]]; then
            CI_PLATFORM="gitlab"
        elif [[ -n "${CIRCLECI:-}" ]]; then
            CI_PLATFORM="circleci"
        else
            CI_PLATFORM="generic"
        fi
    else
        INTERACTIVE=true
        CI_ENVIRONMENT=false
        CI_PLATFORM="local"
    fi

    # Detect container environment
    if [[ -f /.dockerenv ]] || grep -q 'docker\|lxc' /proc/1/cgroup 2>/dev/null; then
        CONTAINER_ENVIRONMENT=true
    else
        CONTAINER_ENVIRONMENT=false
    fi
}

# CI-specific logging
log_ci() {
    local level="$1"
    shift
    local message="$*"

    case "$CI_PLATFORM" in
        github-actions)
            case "$level" in
                error)  echo "::error::$message" ;;
                warn)   echo "::warning::$message" ;;
                group)  echo "::group::$message" ;;
                endgroup) echo "::endgroup::" ;;
                *)      echo "$message" ;;
            esac
            ;;
        gitlab)
            case "$level" in
                error)  echo -e "\e[31mERROR: $message\e[0m" ;;
                warn)   echo -e "\e[33mWARN: $message\e[0m" ;;
                *)      echo "$message" ;;
            esac
            ;;
        *)
            echo "[$level] $message"
            ;;
    esac
}
```

### 5. Volta Installation Security

Never use `curl | bash` in production. Implement secure installation:

```bash
install_volta_secure() {
    local volta_version="${VOLTA_VERSION:-1.1.1}"
    local volta_install_dir="${VOLTA_HOME:-$HOME/.volta}"

    # Skip if already installed
    if [[ -x "$volta_install_dir/bin/volta" ]]; then
        log_info "Volta already installed at $volta_install_dir"
        return 0
    fi

    if [[ "$CI_ENVIRONMENT" == "true" ]]; then
        # CI-specific installation
        case "$CI_PLATFORM" in
            github-actions)
                # Use GitHub Action instead
                log_error "Use volta-cli/setup-volta@v4 action in GitHub Actions"
                return 1
                ;;
            *)
                # Download and verify
                local temp_dir=$(mktemp -d)
                trap "rm -rf '$temp_dir'" EXIT

                local download_url="https://github.com/volta-cli/volta/releases/download/v${volta_version}/volta-${volta_version}-linux-openssl-1.1.tar.gz"
                local checksum_url="${download_url}.sha256"

                # Download with retries
                download_with_retry "$download_url" "$temp_dir/volta.tar.gz"
                download_with_retry "$checksum_url" "$temp_dir/volta.tar.gz.sha256"

                # Verify checksum
                if ! verify_checksum "$temp_dir/volta.tar.gz" "$temp_dir/volta.tar.gz.sha256"; then
                    log_error "Checksum verification failed for Volta"
                    return 1
                fi

                # Extract and install
                tar -xzf "$temp_dir/volta.tar.gz" -C "$temp_dir"
                "$temp_dir/volta-migrate" || true
                mkdir -p "$volta_install_dir/bin"
                mv "$temp_dir/volta" "$volta_install_dir/bin/"
                ;;
        esac
    else
        # Interactive installation with confirmation
        if [[ "$INTERACTIVE" == "true" ]]; then
            echo "This script needs to install Volta for Node.js version management."
            read -p "Install Volta? (y/N) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_error "Volta installation cancelled"
                return 1
            fi
        fi

        # Use official installer for local development
        curl -sSf https://get.volta.sh | bash -s -- --skip-setup
    fi

    # Setup environment
    export VOLTA_HOME="$volta_install_dir"
    export PATH="$VOLTA_HOME/bin:$PATH"
}
```

## Security Hardening

### 6. Environment Variable Sanitization

Prevent environment variable attacks:

```bash
sanitize_environment() {
    # Save required environment variables
    local saved_vars=(
        "HOME" "USER" "SHELL" "TERM" "LANG" "LC_ALL"
        "PATH" "CI" "GITHUB_ACTIONS" "GITLAB_CI"
        "NODE_ENV" "DEBUG" "VOLTA_HOME"
    )

    local saved_values=()
    for var in "${saved_vars[@]}"; do
        saved_values+=("${!var:-}")
    done

    # Clear environment
    if command -v env >/dev/null 2>&1; then
        eval "$(env -i bash -c 'export')"
    fi

    # Restore saved variables
    for i in "${!saved_vars[@]}"; do
        if [[ -n "${saved_values[$i]}" ]]; then
            export "${saved_vars[$i]}=${saved_values[$i]}"
        fi
    done

    # Set secure defaults
    export PATH="/usr/local/bin:/usr/bin:/bin"
    export IFS=$' \t\n'
    unset CDPATH
    umask 022
}
```

### 7. Input Validation

Add comprehensive input validation:

```bash
validate_package_name() {
    local name="$1"
    # Allow only safe package names
    if [[ ! "$name" =~ ^[@a-zA-Z0-9][a-zA-Z0-9._-]*(/[a-zA-Z0-9._-]+)?$ ]]; then
        log_error "Invalid package name: $name"
        return 1
    fi
}

validate_url() {
    local url="$1"
    # Only allow HTTPS URLs
    if [[ ! "$url" =~ ^https://[a-zA-Z0-9.-]+\.[a-z]{2,}(/.*)?$ ]]; then
        log_error "Invalid URL format: $url"
        return 1
    fi
}

validate_path() {
    local path="$1"
    local base_dir="${2:-$(pwd)}"

    # Resolve to absolute path
    local abs_path=$(cd "$(dirname "$path")" 2>/dev/null && pwd || echo "INVALID")
    if [[ "$abs_path" == "INVALID" ]]; then
        log_error "Invalid path: $path"
        return 1
    fi

    # Ensure path is within base directory
    if [[ "$abs_path" != "$base_dir"* ]]; then
        log_error "Path traversal attempt: $path"
        return 1
    fi
}
```

### 8. Logging Security

Implement secure logging with sensitive data redaction:

```bash
setup_secure_logging() {
    local log_dir="${LOG_DIR:-./logs}"
    local log_file="$log_dir/setup-$(date +%Y%m%d-%H%M%S).log"

    # Create log directory with secure permissions
    mkdir -p "$log_dir"
    chmod 750 "$log_dir"

    # Setup log rotation
    setup_log_rotation "$log_dir" "setup-*.log" 10

    # Redirect output with filtering
    exec 3>&1 4>&2
    exec 1> >(tee >(sed -E \
        -e 's/(password[[:space:]]*[:=][[:space:]]*)[^[:space:]]+/\1[REDACTED]/gi' \
        -e 's/(token[[:space:]]*[:=][[:space:]]*)[^[:space:]]+/\1[REDACTED]/gi' \
        -e 's/(key[[:space:]]*[:=][[:space:]]*)[^[:space:]]+/\1[REDACTED]/gi' \
        -e 's/(secret[[:space:]]*[:=][[:space:]]*)[^[:space:]]+/\1[REDACTED]/gi' \
        >> "$log_file"))
    exec 2>&1
}
```

## Best Practice Alignment

### 9. Vercel-Style Environment Management

```bash
setup_vercel_env() {
    # Use .env.local pattern
    if [[ -f ".env.example" ]] && [[ ! -f ".env.local" ]]; then
        cp .env.example .env.local
        log_info "Created .env.local from template"
    fi

    # Validate required environment variables
    local required_vars=(
        "DATABASE_URL"
        "NEXT_PUBLIC_API_URL"
    )

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log_warn "Missing required environment variable: $var"
        fi
    done
}
```

### 10. Microsoft Rush-Style Dependency Management

```bash
setup_rush_style_deps() {
    # Create .npmrc with security settings
    cat > .npmrc << 'EOF'
# Security settings
audit-level=moderate
fund=false
package-lock=false

# Performance settings
prefer-offline=true
cache-min=3600

# pnpm specific
shamefully-hoist=false
strict-peer-dependencies=true
EOF

    # Install with verification
    pnpm install --frozen-lockfile || {
        log_error "Dependency installation failed"
        log_info "Try: pnpm install --no-frozen-lockfile to update lockfile"
        return 1
    }
}
```

## Production-Ready Script Template

Here's a complete, secure implementation incorporating all fixes:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Script metadata
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Import security and utility functions
source "$SCRIPT_DIR/lib/security.sh"
source "$SCRIPT_DIR/lib/platform.sh"
source "$SCRIPT_DIR/lib/logging.sh"

main() {
    # Security first
    sanitize_environment
    setup_secure_logging

    # Detect environment
    detect_platform
    detect_environment

    # Acquire lock
    acquire_lock "$PROJECT_ROOT/.setup.lock" 300

    # Setup
    log_ci group "Setting up development environment"

    if ! install_volta_secure; then
        log_error "Failed to install Volta"
        exit 1
    fi

    if ! setup_node_environment; then
        log_error "Failed to setup Node.js environment"
        exit 1
    fi

    if ! install_dependencies; then
        log_error "Failed to install dependencies"
        exit 1
    fi

    log_ci endgroup
    log_info "Setup completed successfully"
}

# Run with error handling
if ! main "$@"; then
    log_error "Setup failed"
    exit 1
fi
```

## Key Recommendations for Production Deployment

1. **Implement comprehensive testing matrix** covering all target platforms and CI environments
2. **Add rollback capabilities** for all modification operations
3. **Use signed commits and releases** for script distribution
4. **Implement telemetry** for monitoring setup failures in production
5. **Create detailed runbooks** for troubleshooting common issues
6. **Add health checks** to verify successful setup completion
7. **Implement retry logic** with exponential backoff for network operations
8. **Use structured logging** compatible with your monitoring stack

This analysis provides the foundation for transforming your draft script into a production-ready solution that handles the complexities of modern monorepo development across diverse environments.
