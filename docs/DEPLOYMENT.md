# Deployment Guide

## Overview

This monorepo supports both single-app and multi-app deployment configurations with automatic domain detection.

## Deployment Types

### 1. Custom Domain Deployment

For repositories that have a custom domain configured:

- **Automatic**: `ryleebrasseur/portfolio` automatically deploys to `ryleeworks.com`
- **Manual**: Set `CUSTOM_DOMAIN` repository variable in GitHub settings

**Features:**
- Assets served from root path (`/assets/`)
- CNAME file automatically created
- Base path set to `/`

### 2. GitHub Pages Subdirectory Deployment

For repositories without custom domain:

- Assets served from subdirectory (`/portfolio/assets/`)
- No CNAME file created
- Base path set to `/portfolio/`

### 3. Multi-App Deployment (Prime Inc Portfolio)

The current repository supports deploying multiple portfolio apps:

- `robin-noguier` app at `/robin-noguier/`
- `vilinskyy` app at `/vilinskyy/`
- Index page with navigation between apps

## Configuration

### Environment Variables

Each app supports environment configuration via `.env` files:

```bash
# Copy example file
cp apps/robin-noguier/.env.example apps/robin-noguier/.env

# Edit configuration
VITE_BASE_PATH=/
CUSTOM_DOMAIN=your-domain.com
```

### Repository Variables

Set in GitHub repository settings → Secrets and variables → Actions:

- `CUSTOM_DOMAIN`: Your custom domain (e.g., `example.com`)

## Testing Deployment

Run the deployment test script to verify configuration:

```bash
# Make script executable
chmod +x test-deployment.sh

# Run tests
./test-deployment.sh
```

The script tests:
- Subdirectory deployment configuration
- Custom domain deployment configuration
- Environment file setup
- Automatic domain detection logic
- Multi-app deployment structure

## Build Process

### Single App Build
```bash
# Build specific app
pnpm build --filter=robin-noguier

# Build with environment variables
VITE_BASE_PATH=/portfolio/ pnpm build --filter=robin-noguier
```

### Multi-App Build
```bash
# Build all apps
./scripts/build-for-gh-pages.sh
```

## Deployment Workflow

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. Detects repository and sets appropriate configuration
2. Builds apps with correct base paths
3. Creates CNAME file if custom domain is configured
4. Deploys to GitHub Pages

### Trigger Deployment

- **Automatic**: Push to `main` branch
- **Manual**: Use "Run workflow" in GitHub Actions tab

## Troubleshooting

### Common Issues

1. **Assets not loading**: Check `VITE_BASE_PATH` configuration
2. **Custom domain not working**: Verify DNS settings and CNAME file
3. **Build failures**: Check environment variables and dependencies

### Debug Steps

1. Run local build with same environment variables:
   ```bash
   VITE_BASE_PATH=/portfolio/ pnpm build --filter=robin-noguier
   ```

2. Check generated HTML for asset paths:
   ```bash
   cat apps/robin-noguier/dist/index.html | grep "assets/"
   ```

3. Run deployment tests:
   ```bash
   ./test-deployment.sh
   ```

## Repository-Specific Notes

### ryleebrasseur/portfolio
- Automatically deploys to `ryleeworks.com`
- Single-app deployment (robin-noguier only)
- Clean, streamlined build process

### primeinc/portfolio
- Multi-app deployment structure
- Supports both robin-noguier and vilinskyy apps
- Index page with app navigation
- Compatible with Rylee's improvements