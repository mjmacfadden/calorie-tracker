# Deployment Guide - GitHub Pages

This guide will help you deploy the Calorie Tracker to GitHub Pages in 5 minutes.

## Prerequisites

- GitHub account
- Git installed on your computer
- Code pushed to a GitHub repository

## Step-by-Step Deployment

### Option 1: Deploy from `/src` folder (Recommended)

1. **Push your code to GitHub:**
   ```bash
   cd /Users/mmacfadden/Documents/GitHub/Calorie\ Tracker
   git add .
   git commit -m "Initial commit: Calorie Tracker app"
   git push origin main
   ```

2. **Go to repository Settings:**
   - Navigate to your repo on GitHub
   - Click "Settings" (top right)
   - Click "Pages" in the left sidebar

3. **Configure GitHub Pages:**
   - Under "Source", select `Deploy from a branch`
   - Select `main` branch
   - Select `/root` folder (this will serve from the root of src/)
   - Click "Save"

4. **Create a `.nojekyll` file (optional but recommended):**
   ```bash
   touch .nojekyll
   git add .nojekyll
   git commit -m "Add .nojekyll for GitHub Pages"
   git push origin main
   ```

5. **Wait for deployment:**
   - GitHub will build and deploy
   - Check the Actions tab to see build status
   - Your site will be live at: `https://YOUR_USERNAME.github.io/Calorie-Tracker/`

### Option 2: Deploy entire repo

If your site structure is at the root:

1. Ensure all files from `src/` are at repository root level
2. Follow Option 1 steps, but select `/` (root) as the source folder

## Verify Deployment

1. Visit: `https://YOUR_USERNAME.github.io/Calorie-Tracker/`
2. You should see the Calorie Tracker app load
3. Try logging a food to confirm it works

## Troubleshooting

### Site shows 404?
- Check Settings > Pages shows "Your site is live"
- Wait 1-2 minutes for initial deployment
- Check that branch is correctly set to `main` or `gh-pages`

### CSS/JS not loading?
- Check browser console for 404 errors
- Verify file paths in `index.html` are correct
- Clear browser cache (Ctrl+Shift+Delete)

### Data not persisting?
- This is expected! Data is stored locally in each browser
- Check browser console for any errors
- Verify localStorage isn't disabled in browser settings

## Making Updates

After deployment, to update your site:

1. Make changes to your files
2. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. GitHub will automatically rebuild and deploy
4. Changes should appear within 1-2 minutes

## Custom Domain (Optional)

To use a custom domain (e.g., calorietracker.com):

1. Go to Settings > Pages
2. Add your domain under "Custom domain"
3. Follow the DNS configuration steps
4. Point your domain DNS to GitHub's IP addresses

## Reverting to Local Development

If you want to go back to local development:

```bash
# Disable GitHub Pages
# Go to Settings > Pages > Source > None

# Run local server
python -m http.server 8000 --directory src
# Visit: http://localhost:8000
```

---

**Questions?** Check the README.md or PROMPT.md for more info.
