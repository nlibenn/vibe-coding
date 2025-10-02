# Vibe Coding – Simple App

A minimal static starter with a light/dark vibe toggle and a small landing page.

## Run locally

- Option 1: Open `index.html` directly in your browser.
- Option 2: Serve with a simple web server (recommended):

```bash
# From the project root
python3 -m http.server 5173
# then open http://localhost:5173
```

## Customize

- Edit `index.html` to change content.
- Edit `styles.css` to tweak colors or layout. Theme variables live under `:root` and `html[data-theme="light"]`.
- Edit `script.js` to adjust interactions. Theme preference is persisted to `localStorage`.

## Deploy

This is a static site. You can deploy to any static host (GitHub Pages, Netlify, Vercel, S3, etc.).
