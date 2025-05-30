#!/usr/bin/env bash

# Test script to verify setup script idempotence
# Run this to ensure the setup script is truly idempotent

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧪 Testing Setup Script Idempotence"
echo "=================================="

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test functions
run_test() {
  local test_name=$1
  local test_function=$2
  
  echo ""
  echo "📋 Test: $test_name"
  ((TESTS_RUN++))
  
  if $test_function; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAILED${NC}"
    ((TESTS_FAILED++))
  fi
}

# Test 1: Check shell profile idempotence
test_shell_profile_idempotence() {
  local shell_profile="$HOME/.bashrc"
  if [[ -n "${ZSH_VERSION:-}" ]]; then
    shell_profile="$HOME/.zshrc"
  fi
  
  if [[ ! -f "$shell_profile" ]]; then
    echo "Shell profile not found, skipping test"
    return 0
  fi
  
  local volta_count=$(grep -c "VOLTA_HOME" "$shell_profile" || true)
  
  if [[ $volta_count -gt 1 ]]; then
    echo "Found $volta_count VOLTA_HOME entries (expected 0 or 1)"
    return 1
  fi
  
  echo "Shell profile entries: $volta_count (OK)"
  return 0
}

# Test 2: Check for file accumulation
test_file_accumulation() {
  local temp_files=$(find . -maxdepth 1 -name ".dev-server-wrapper.sh*" -o -name "stop-dev-server.sh.old" | wc -l)
  
  if [[ $temp_files -gt 2 ]]; then
    echo "Found $temp_files temporary files (expected <= 2)"
    return 1
  fi
  
  # Check log accumulation
  if [[ -d "logs" ]]; then
    local log_count=$(ls logs/dev-server-*.log 2>/dev/null | wc -l)
    if [[ $log_count -gt 10 ]]; then
      echo "Found $log_count server logs (expected <= 10)"
      return 1
    fi
  fi
  
  # Check setup log rotation
  if [[ -d ".setup-logs" ]]; then
    local old_logs=$(find .setup-logs -name "setup-*.log*" -mtime +7 | wc -l)
    if [[ $old_logs -gt 0 ]]; then
      echo "Found $old_logs old setup logs (expected 0)"
      return 1
    fi
  fi
  
  echo "No file accumulation detected (OK)"
  return 0
}

# Test 3: Check lock file handling
test_lock_file_handling() {
  if [[ -f ".setup.lock" ]]; then
    local lock_pid=$(cat .setup.lock 2>/dev/null || echo "")
    if [[ -n "$lock_pid" ]] && ! kill -0 "$lock_pid" 2>/dev/null; then
      echo "Stale lock file found with dead PID $lock_pid"
      return 1
    fi
  fi
  
  echo "Lock file handling correct (OK)"
  return 0
}

# Test 4: Check PID file validity
test_pid_file_validity() {
  if [[ -f ".dev-server.pid" ]]; then
    local pid=$(cat .dev-server.pid 2>/dev/null || echo "")
    if [[ -n "$pid" ]]; then
      if ! kill -0 "$pid" 2>/dev/null; then
        echo "Stale PID file found with dead process $pid"
        return 1
      fi
      
      # Check if it's actually a node process
      local process_name=$(ps -p "$pid" -o comm= 2>/dev/null || echo "")
      if [[ "$process_name" != *"node"* ]]; then
        echo "PID $pid is not a node process (found: $process_name)"
        return 1
      fi
    fi
  fi
  
  echo "PID file validity check passed (OK)"
  return 0
}

# Test 5: Check version consistency
test_version_consistency() {
  if command -v node &>/dev/null; then
    local node_version=$(node -v | sed 's/v//')
    if [[ "$node_version" != "20.17.0" ]]; then
      echo "Node version $node_version != 20.17.0"
      return 1
    fi
  fi
  
  if command -v pnpm &>/dev/null; then
    local pnpm_version=$(pnpm -v 2>/dev/null || echo "")
    if [[ "$pnpm_version" != "9.12.0" ]]; then
      echo "pnpm version $pnpm_version != 9.12.0"
      return 1
    fi
  fi
  
  echo "Version consistency check passed (OK)"
  return 0
}

# Test 6: Check for orphaned processes
test_orphaned_processes() {
  local orphaned=$(ps aux | grep -E "(dev-server-wrapper|stop-dev-server)" | grep -v grep | wc -l)
  
  if [[ $orphaned -gt 0 ]]; then
    echo "Found $orphaned orphaned processes"
    ps aux | grep -E "(dev-server-wrapper|stop-dev-server)" | grep -v grep
    return 1
  fi
  
  echo "No orphaned processes found (OK)"
  return 0
}

# Test 7: Simulate multiple runs
test_multiple_runs() {
  echo "Running setup script 3 times..."
  
  for i in {1..3}; do
    echo "  Run $i..."
    if ! ./dev_setup_idempotent.sh </dev/null >/dev/null 2>&1; then
      echo "Setup script failed on run $i"
      return 1
    fi
  done
  
  echo "Multiple runs completed successfully (OK)"
  return 0
}

# Test 8: Check log file structure
test_log_file_structure() {
  if [[ -d ".setup-logs" ]]; then
    local today=$(date +%Y%m%d)
    local log_file=".setup-logs/setup-$today.log"
    
    if [[ -f "$log_file" ]]; then
      # Check if log has proper structure
      if ! grep -q "===== Setup started at" "$log_file"; then
        echo "Log file missing proper headers"
        return 1
      fi
      
      # Check log size
      local size=$(stat -f%z "$log_file" 2>/dev/null || stat -c%s "$log_file" 2>/dev/null || echo 0)
      if [[ $size -gt 10485760 ]]; then
        echo "Log file too large: $size bytes (max 10MB)"
        return 1
      fi
    fi
  fi
  
  echo "Log file structure correct (OK)"
  return 0
}

# Run all tests
run_test "Shell Profile Idempotence" test_shell_profile_idempotence
run_test "File Accumulation" test_file_accumulation
run_test "Lock File Handling" test_lock_file_handling
run_test "PID File Validity" test_pid_file_validity
run_test "Version Consistency" test_version_consistency
run_test "Orphaned Processes" test_orphaned_processes
run_test "Log File Structure" test_log_file_structure

# Only run multiple runs test if requested
if [[ "${RUN_FULL_TEST:-false}" == "true" ]]; then
  run_test "Multiple Runs" test_multiple_runs
else
  echo ""
  echo "ℹ️  Skipping multiple runs test (set RUN_FULL_TEST=true to enable)"
fi

# Summary
echo ""
echo "====================================="
echo "Test Summary:"
echo "  Tests Run: $TESTS_RUN"
echo -e "  Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "  Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [[ $TESTS_FAILED -eq 0 ]]; then
  echo -e "${GREEN}✅ All idempotence tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some idempotence tests failed${NC}"
  echo ""
  echo "Common fixes:"
  echo "  - Remove duplicate entries from shell profile"
  echo "  - Clean up old log files: rm -rf logs/dev-server-*.log"
  echo "  - Remove stale lock file: rm -f .setup.lock"
  echo "  - Kill orphaned processes: pkill -f dev-server-wrapper"
  exit 1
fi