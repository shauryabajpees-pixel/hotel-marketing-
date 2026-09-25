# Aura Grand Hotel & PMS — Web App

A full-stack luxury hotel booking engine & Property Management System (PMS) featuring real-time room availability, concurrency-safe reservation holds, interactive Gantt room chart, housekeeping kanban, and dynamic rate management.

---

## 🚀 Deploying to GitHub Pages

This repository is pre-configured with two deployment options for GitHub Pages:

### Option 1: Automatic Deployment via GitHub Actions (Recommended)

1. Push this repository to GitHub (`main` or `master` branch).
2. On GitHub, navigate to **Settings** > **Pages** in your repository.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. That's it! The workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will automatically build your app and deploy it to `https://<username>.github.io/<repository-name>/`.
5. You can also trigger it manually anytime under the **Actions** tab by selecting **Deploy to GitHub Pages** > **Run workflow**.

---

### Option 2: Deploying via `gh-pages` Branch

If your GitHub repository is configured to deploy from a branch:

1. On GitHub, make sure your repository settings allow Pages: **Settings** > **Pages** > **Source**: **Deploy from a branch**.
2. Run the deploy script in your terminal:
   ```bash
   npm run deploy
   ```
   *(This automatically runs `npm run build` and publishes the generated `dist/` directory to your `gh-pages` branch).*
3. Under **Settings** > **Pages**, ensure the branch is set to `gh-pages` and folder is `/(root)`.

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📋 What Was Fixed for GitHub Pages

1. **GitHub Actions Workflow**: Added `.github/workflows/deploy.yml` with necessary token permissions (`pages: write`, `id-token: write`) and automated Node 20 build.
2. **Relative Assets (`base: './'`)**: Assets in Vite are bundled with relative paths (`./assets/...`) so they load correctly on repository subpaths like `https://<username>.github.io/<repo>/` without returning 404 or blank screens.
3. **SPA Fallback (`404.html`)**: Automatically duplicates `index.html` to `dist/404.html` during build to prevent 404 errors on page refreshes.
4. **Jekyll Bypass (`.nojekyll`)**: Added `.nojekyll` to `public/` so GitHub Pages skips Jekyll processing and correctly serves all compiled assets and chunks.
5. **NPM Deploy Script**: Added `gh-pages` devDependency along with `"deploy": "gh-pages -d dist"` for 1-command deployment.
