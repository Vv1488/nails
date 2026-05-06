#!/bin/bash
set -e
source .env
echo "Building..."
npm run build
echo "Deploying to GitHub Pages..."
cd dist
rm -rf .git
git init
git add -A
git commit -m "deploy $(date +%Y-%m-%d_%H:%M)"
git push https://Vv1488:${GITHUB_TOKEN}@github.com/Vv1488/nails.git HEAD:gh-pages --force
cd ..
echo "Done! Site: https://vv1488.github.io/nails/"
