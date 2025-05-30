# Changelog

All notable changes to the Portfolio Monorepo Development Setup Script will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-05-30

### Added
- **Network Retry Logic**: Implemented `download_with_retry()` function with exponential backoff (2s, 4s, 8s delays)
  - Volta installer now uses retry logic for resilient downloads
  - pnpm install commands wrapped with `execute_with_retry()` for better reliability
  - Automatic fallback to offline mode for pnpm when retries fail

- **Enhanced Signal Handling**: Comprehensive signal handling for graceful shutdown
  - Added `cleanup_on_signal()` function for INT, TERM, and HUP signals
  - Child process tracking with `register_child_process()` and `kill_child_processes()`
  - Proper cleanup sequence with correct exit codes (128 + signal number)
  - Graceful termination with SIGTERM before SIGKILL

- **Resource Pre-flight Checks**: System resource validation before setup
  - Disk space check (minimum 1GB required)
  - Memory check (512MB recommended, warns if less)
  - File system permission verification
  - Symlink capability testing
  - Container-aware resource checking (cgroup limits)

### Changed
- Improved error handling throughout the script
- Enhanced logging for network operations
- Better process management for background tasks

### Security
- All network operations now have timeout protection
- Improved cleanup on script interruption prevents orphaned processes

## [1.0.0] - 2025-05-30

### Added
- Initial release with idempotent setup script
- Cross-platform support (macOS, Linux, WSL2)
- Volta-based Node.js version management
- Automatic dependency installation
- Git hooks setup
- Development server management
- Comprehensive logging with rotation
- Lock file management to prevent concurrent runs
- Security hardening with input validation and sensitive data redaction

### Security
- Environment variable sanitization
- Path and URL validation
- Secure download verification
- No curl|bash piping for installations