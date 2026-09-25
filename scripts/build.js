import fs from 'node:fs';

// Duplicate index.html to 404.html for SPA routing fallback on GitHub Pages
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'dist/404.html');
}

// Ensure .nojekyll exists in dist
if (!fs.existsSync('dist/.nojekyll')) {
  fs.writeFileSync('dist/.nojekyll', '');
}

