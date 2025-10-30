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

## Supabase integration

This project can connect to Supabase in the browser using the anon key.

1) Create `config.js` (or edit it) with your project values:

```js
export const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_PUBLIC_KEY";
```

2) Ensure `index.html` loads scripts in this order (already set):

```html
<script type="module" src="config.js"></script>
<script type="module" src="script.js"></script>
```

3) The UI will show a small status: "Supabase: configured" or "not configured".

Notes:
- The anon key is safe to expose in the frontend. Do NOT expose the service role key in the browser.
- For privileged operations, deploy a tiny backend on Render and use the service role key as an environment variable there.

## Deploy

This is a static site. You can deploy to any static host (GitHub Pages, Netlify, Vercel, S3, etc.).

### GitHub Pages (Actions)
Already configured via `.github/workflows/pages.yml`. Push to `main` to deploy, then check Settings → Pages for the URL.
