# TechXpert — Migration Notes & Deployment Guide

## What changed

**Client (`/client`)**
- Migrated from Create React App (`react-scripts`) → **Vite**. This is what was breaking on your machine — `react-scripts` pins very old, unmaintained tooling that constantly clashes with newer Node versions. Vite is actively maintained, starts in ms, and is what Vercel expects.
- All `.js` component files renamed to `.jsx` (they contain JSX; Vite wants the extension explicit).
- `public/index.html` → moved to project root as `index.html`, `%PUBLIC_URL%` references removed, `<script type="module" src="/src/main.jsx">` added (Vite's entry pattern).
- `src/index.js` → `src/main.jsx`, `src/App.js` → `src/App.jsx`.
- Every hardcoded `http://localhost:5000` API call replaced with `${API_BASE}` from the new `src/config.js`, which reads `import.meta.env.VITE_API_URL` (Vite's env convention — `process.env.REACT_APP_*` doesn't work here anymore).
- Removed CRA-only cruft: `react-scripts`, `web-vitals`, test scaffolding.
- Found and fixed an **unresolved git merge conflict** sitting in the root `.gitignore` (`<<<<<<< HEAD ... >>>>>>> origin/main`) — worth knowing in case you see similar markers elsewhere if you ever `git merge` again.

**Media (logos, background images, the demo video)**
- Your backend already uses Cloudinary correctly for user-uploaded videos/thumbnails/certificates (`multer-storage-cloudinary` in `routes/video.js` and `routes/certificate.js`) — that part didn't need touching.
- What *was* sitting on disk were static site assets bundled straight into the React app: `logoHome.png`, `logoNav.png`, `logoclass.png`, `logofoot.png`, `back1/2/3.png`, `certificate.jpg`, and a 6.4 MB `video1.mp4`. These were moved out of `client/src` into `/assets-for-cloudinary` at the project root, and every component now imports URLs from `client/src/config/media.js` instead of importing the files directly.
- `scripts/upload-assets-to-cloudinary.cjs` uploads those files to your Cloudinary account and writes the real URLs into `media.js` automatically. Run it once (step 3 below).
- The 7 Lottie `animation*.json` files were left as-is — they're small vector files, not worth externalizing.

**Server (`/server`)**
- Fixed a real bug: `app.listen(process.env.PORT, ...)` would crash locally since `PORT` was never set outside Vercel. Now falls back to `5000`.
- Replaced `cors({ origin: '*', credentials: true })` — that combination is actually invalid per the CORS spec and browsers will reject it silently — with an explicit allow-list read from `CLIENT_URL`.
- Added `.env.example` for the variables you already had wired up (`MONGODB_URI`, `JWT_SECRET`, `CLOUD_NAME`, `API_KEY`, `API_SECRET`) plus the new `CLIENT_URL`.

---

## Step-by-step: going live

### 1. Prerequisites
- Node.js 20+ installed locally.
- Accounts (all have free tiers): [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), [Cloudinary](https://cloudinary.com), [Vercel](https://vercel.com), and **[Render](https://render.com)** for the backend (see note below on why not Vercel for this backend).
- Push this project to a GitHub repo — Vercel/Render both deploy straight from GitHub.

> **Why Render (not Vercel) for the backend:** Vercel runs Node code as short-lived serverless functions. Your server uses two things that fight that model: `canvas` (a native/compiled module — Vercel's build environment frequently fails to compile it or produces mismatched binaries) and a persistent Mongoose connection (serverless functions cold-start per request, which causes connection storms against MongoDB). Render runs your Express app as a normal long-lived Node process, so both "just work" with zero code changes. Railway or Fly.io would work equally well if you prefer those.

### 2. MongoDB Atlas
1. Create a free cluster → Database Access: create a user/password → Network Access: add `0.0.0.0/0` (allow from anywhere, since Render's IPs aren't static on the free tier).
2. Get your connection string (Connect → Drivers) — this is your `MONGODB_URI`.

### 3. Cloudinary — migrate the static assets
1. Sign up, go to the Dashboard, copy your **Cloud name**, **API Key**, **API Secret**.
2. `cd server && cp .env.example .env` and fill in `CLOUD_NAME`, `API_KEY`, `API_SECRET` (leave the rest for now).
3. `cd server && npm install`
4. From the project root: `node scripts/upload-assets-to-cloudinary.cjs`
   - This uploads everything in `/assets-for-cloudinary` and rewrites `client/src/config/media.js` with the real Cloudinary URLs.
5. Once it prints "Done", delete `/assets-for-cloudinary` — you don't need the local copies anymore, and it's already in `.gitignore` so it won't get committed either way.

### 4. Deploy the backend (Render)
1. Render dashboard → New → Web Service → connect your GitHub repo.
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables (from your `server/.env`): `MONGODB_URI`, `JWT_SECRET` (make up a long random string), `CLOUD_NAME`, `API_KEY`, `API_SECRET`, `CLIENT_URL` (you'll fill this in after step 5 once you have your Vercel URL — you can redeploy after).
6. Deploy. Once live, note the URL, e.g. `https://techxpert-server.onrender.com`. Visit it — you should see "TechXpert API is running".

*(Free-tier Render services spin down after inactivity and take ~30s to wake on the first request — fine for a personal project, worth knowing.)*

### 5. Deploy the frontend (Vercel)
1. Vercel dashboard → Add New → Project → import the same GitHub repo.
2. Root Directory: `client`
3. Framework Preset: Vercel should auto-detect **Vite**. Build command `vite build` (or `npm run build`), output directory `dist` — these are auto-filled by the Vite preset.
4. Environment Variables → add `VITE_API_URL` = your Render backend URL from step 4 (e.g. `https://techxpert-server.onrender.com`).
5. Deploy. Vercel gives you a URL like `https://techxpert.vercel.app`.

### 6. Close the loop on CORS
1. Go back to Render → your backend service → Environment → set `CLIENT_URL` to your Vercel URL from step 5.
2. Redeploy the backend (Render redeploys automatically when you save env vars, or trigger manually).

### 7. Smoke test
- Visit your Vercel URL, sign up a user, upload a video (check it lands in your Cloudinary media library), generate a certificate, check the logos/background/video all load from Cloudinary (open DevTools → Network → filter by `res.cloudinary.com`).

---

## Local development after this migration
```bash
# backend
cd server
cp .env.example .env   # fill in real values
npm install
npm start               # or: npx nodemon index.js

# frontend, in a second terminal
cd client
cp .env.example .env    # VITE_API_URL=http://localhost:5000
npm install
npm run dev              # Vite dev server on http://localhost:3000
```

## If you'd still rather run the backend on Vercel too
It's possible but needs more surgery than fits here: swap `canvas` for a WASM-based canvas alternative (`@napi-rs/canvas` tends to work better on Vercel) or generate certificates via an external image service, and restructure `index.js` to export the Express `app` instead of calling `.listen()`, with routes moved under `/api`. Happy to do that migration too if you'd rather have everything on one platform — just say the word.
