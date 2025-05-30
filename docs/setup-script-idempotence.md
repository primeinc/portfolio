# Setup Script Idempotence Documentation

## Overview

The `dev_setup_idempotent.sh` script is designed to be **truly idempotent** - it can be run any number of times without causing side effects or accumulating artifacts. This document details the idempotence guarantees and testing procedures.

## Idempotence Guarantees

### 1. **Lock File Protection**

- Uses `.setup.lock` to prevent concurrent runs
- 30-second timeout with clear error messages
- Automatically cleaned up on exit (even on crash via trap)

### 2. **Log Rotation**

- Daily log files: `setup-YYYYMMDD.log`
- Automatic rotation at 10MB
- Old logs deleted after 7 days
- Server logs limited to last 10 files

### 3. **Shell Profile Safety**

- Checks for existing Volta configuration before adding
- Never duplicates PATH or environment variables
- Uses unique comment markers for identification

### 4. **Version Management**

- Always enforces exact versions (Node 20.17.0, pnpm 9.12.0)
- Detects and corrects version mismatches
- No partial installations possible

### 5. **Process Management**

- PID files validated before killing processes
- Old processes cleaned up before starting new ones
- Stop scripts always contain current PID

### 6. **File Management**

- Temporary files use consistent names (always overwritten)
- Old artifacts cleaned up at start of each run
- No accumulation of stop scripts or wrappers

### 7. **Dependency Installation**

- Checks if dependencies are already up-to-date
- Uses `--dry-run` to verify before installing
- Skips installation if nothing changed

## Testing Idempotence

### Test 1: Multiple Sequential Runs

```bash
# Run 10 times in a row
for i in {1..10}; do
  echo "Run $i"
  ./dev_setup_idempotent.sh
done

# Verify:
# - No duplicate Volta entries in ~/.bashrc or ~/.zshrc
# - Only one log file per day
# - Correct Node/pnpm versions
# - No accumulating files
```

### Test 2: Concurrent Run Protection

```bash
# Terminal 1
./dev_setup_idempotent.sh

# Terminal 2 (immediately)
./dev_setup_idempotent.sh
# Should wait or exit with lock error
```

### Test 3: Partial Installation Recovery

```bash
# Simulate partial Volta install
rm -rf ~/.volta/bin/node
./dev_setup_idempotent.sh
# Should detect and fix

# Simulate wrong versions
volta install node@18.0.0
./dev_setup_idempotent.sh
# Should correct to 20.17.0
```

### Test 4: Clean State After Crashes

```bash
# Start setup and kill it
./dev_setup_idempotent.sh &
PID=$!
sleep 2
kill -9 $PID

# Run again
./dev_setup_idempotent.sh
# Should clean up and run normally
```

### Test 5: File Accumulation Check

```bash
# Count files before
find . -name "stop-dev-server.sh" -o -name ".dev-server-wrapper.sh" | wc -l
ls logs/dev-server-*.log 2>/dev/null | wc -l

# Run 20 times
for i in {1..20}; do ./dev_setup_idempotent.sh; done

# Count files after - should be same or less
find . -name "stop-dev-server.sh" -o -name ".dev-server-wrapper.sh" | wc -l
ls logs/dev-server-*.log 2>/dev/null | wc -l
```

## Key Improvements Over Original

1. **Lock File System**

   - Prevents race conditions
   - Clear feedback when blocked

2. **Daily Log Rotation**

   - Prevents infinite growth
   - Automatic cleanup of old logs

3. **Dry Run Checks**

   - Avoids unnecessary dependency reinstalls
   - Faster subsequent runs

4. **Process Validation**

   - PID files checked for live processes
   - No orphaned process accumulation

5. **Atomic File Operations**

   - Always overwrite instead of append
   - No partial file states

6. **Version Enforcement**
   - Exit if versions can't be corrected
   - No "works sometimes" scenarios

## Edge Cases Handled

### Native Windows Block

```
❌ ERROR: Native Windows is not supported. Please use WSL2.
```

### Missing Volta After Install

- Falls back to error instead of continuing
- Forces user to fix environment

### Corrupted package.json

- Validated at end of setup
- Clear error if Volta config missing

### Port Already in Use

- Provides stop script path
- Shows current PID for debugging

### CI Environment

- Skips interactive prompts
- Uses frozen lockfile
- No dev server start

## Monitoring Idempotence

Check for violations:

```bash
# Check for duplicate shell entries
grep -c "VOLTA_HOME" ~/.bashrc ~/.zshrc

# Check for file accumulation
find . -name "*.log" -mtime +7 | wc -l  # Should be 0

# Check for orphaned processes
ps aux | grep -E "(node|pnpm|vite)" | grep -v grep

# Check lock file
ls -la .setup.lock  # Should not exist
```

## Recovery Procedures

### If Lock File Stuck

```bash
# Check if setup is actually running
ps aux | grep dev_setup | grep -v grep

# If not running, remove lock
rm -f .setup.lock
```

### If Versions Wrong After Setup

```bash
# Force reinstall
volta uninstall node
volta uninstall pnpm
./dev_setup_idempotent.sh
```

### If Logs Growing Too Large

```bash
# Manual cleanup
rm -rf .setup-logs
./dev_setup_idempotent.sh
```

## Idempotence Contract

The script guarantees:

1. **End State Consistency**: System will always end in the same state regardless of starting state
2. **No Side Effect Accumulation**: Running N times has same effect as running once
3. **Self-Healing**: Detects and fixes inconsistent states
4. **Atomic Operations**: All changes are atomic - no partial states
5. **Resource Cleanup**: All resources (files, processes) are properly managed

## Testing Checklist

Before declaring the script idempotent, verify:

- [ ] Can run 100+ times without errors
- [ ] No duplicate shell profile entries
- [ ] No growing log files beyond rotation
- [ ] No accumulating temporary files
- [ ] No orphaned processes
- [ ] Handles all interruption scenarios
- [ ] Version enforcement works reliably
- [ ] Lock file prevents concurrent runs
- [ ] All files have deterministic names
- [ ] Clean state after any failure mode
