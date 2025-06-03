# GitHub Pages Deployment

This repository is configured for repository-agnostic GitHub Pages deployment. The deployment automatically adapts to any repository name.

## How It Works

1. **Landing Page**: The root `index.html` serves as a landing page with links to both portfolio apps.

2. **Dynamic Base Paths**: The build script automatically detects the repository name and sets the correct base paths for each app.

3. **Deployment Structure**:
   ```
   https://[username].github.io/[repo-name]/
   ├── index.html (landing page)
   ├── robin-noguier/ (Robin Noguier portfolio)
   └── vilinskyy/ (Vilinskyy portfolio)
   ```

## Deployment Process

The deployment is handled by `.github/workflows/deploy.yml` which:

1. Triggers on pushes to `main` branch
2. Runs the build script `scripts/build-for-gh-pages.sh`
3. Builds both apps with dynamic base paths
4. Creates a deployment directory with the landing page and both apps
5. Deploys to GitHub Pages

## Local Development

For local development, the apps run on their default ports:

- Robin Noguier: http://localhost:5173
- Vilinskyy: http://localhost:5174

## Adding New Apps

To add a new portfolio app:

1. Create the app in `apps/[app-name]/`
2. Configure its `vite.config.ts` to use `process.env.VITE_BASE_PATH`
3. Update `scripts/build-for-gh-pages.sh` to build the new app
4. Update the landing page (`index.html`) to include a link to the new app
5. Update the deploy workflow to copy the new app's dist folder

## Repository Agnostic

The deployment automatically adapts to any repository name. When forked or renamed, no configuration changes are needed - the build script will detect the new repository name and set paths accordingly.
