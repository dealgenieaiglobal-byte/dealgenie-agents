# DealGenie AI — Demo Agent Slug Pages (GitHub Upload Ready)

This zip is **everything you need** to upload to a new GitHub repo and deploy a luxury black+gold **agent mini‑site**.

## What you get
- `/` → landing demo page
- `/agent/<slug>` → dynamic agent pages (example: `/agent/bharat`)
- Data-driven content from `/data/agents.json`
- Optional Botpress embed (toggle in `/assets/config.js`)
- Optional lead form webhook to Make.com (set URL in `/assets/config.js`)

---

## Deploy Option A — Netlify (recommended for clean routing)
1. Create a new GitHub repo, upload all files from this zip.
2. In Netlify: **Add new site → Import from GitHub**
3. Build settings:
   - Build command: (leave blank)
   - Publish directory: `/` (root)
4. Done. Slugs work because `_redirects` is included.

---

## Deploy Option B — GitHub Pages (works too)
1. In your repo: Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` and folder: `/root`
4. Wait for Pages to publish.
5. Slugs work via `404.html` SPA fallback.

---

## Customize
### 1) Add agents
Edit: `/data/agents.json`

### 2) Change images
Replace files in: `/assets/img/`

### 3) Enable Botpress
Edit: `/assets/config.js`

```js
window.DG_BOTPRESS.enabled = true;
window.DG_BOTPRESS.inject  = "https://cdn.botpress.cloud/webchat/v3.5/inject.js";
window.DG_BOTPRESS.config  = "YOUR_BOT_CONFIG_JS_URL";
```

### 4) Connect lead form to Make.com webhook
Edit: `/assets/config.js`

```js
window.DG_FORM.webhookUrl = "https://hook.us2.make.com/xxxxxxxxxxxx";
```

---

## Notes
- This demo keeps everything static + fast.
- For Airtable: do **NOT** put Airtable tokens in frontend JS. Use a serverless function/proxy later.
