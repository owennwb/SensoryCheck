# SensoryCheck 🎧

Community sensory ratings for live shows and venues. Know what to expect before you book.

---

## Deploy in ~30 minutes (free, no credit card)

### Step 1 — Set up Supabase (your database + auth)

1. Go to **https://supabase.com** and click "Start your project"
2. Sign up with GitHub or email (free)
3. Click "New project" — give it a name like `sensorycheck`, pick a region close to you, set a database password (save this somewhere)
4. Wait ~2 minutes for it to spin up
5. In the left sidebar, click **SQL Editor**
6. Copy the entire contents of `SUPABASE_SETUP.sql` and paste it in — click **Run**
7. Go to **Project Settings → API** and copy:
   - `Project URL` (looks like `https://abcdefgh.supabase.co`)
   - `anon public` key (long string starting with `eyJ...`)

### Step 2 — Set up your code on GitHub

1. Go to **https://github.com** and create a free account if you don't have one
2. Click the **+** icon → "New repository" → name it `sensorycheck` → click "Create repository"
3. Download this project folder to your computer
4. Copy the file `.env.example` and rename the copy to `.env.local`
5. Open `.env.local` and fill in your Supabase values:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJ...your-anon-key...
   ```
6. Upload all the files to your GitHub repo (drag and drop in the browser, or use GitHub Desktop app)

### Step 3 — Deploy on Vercel (free hosting)

1. Go to **https://vercel.com** and click "Sign up" — use "Continue with GitHub"
2. Click "Add New Project"
3. Find your `sensorycheck` repo and click "Import"
4. Before clicking Deploy, click **"Environment Variables"** and add:
   - `REACT_APP_SUPABASE_URL` = your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy** — wait ~2 minutes
6. Vercel gives you a free URL like `sensorycheck-xyz.vercel.app` 🎉

---

## Your app is live!

- Browse shows at `your-url.vercel.app`
- Sign up for an account and submit your first review
- Share the URL with others to grow the community

---

## Adding more shows

In your Supabase dashboard → **Table Editor → shows** → click "Insert row" to add shows manually. Or signed-in users can eventually submit shows directly (you can build that feature later).

---

## Project structure

```
sensorycheck/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Nav.js          # Top navigation bar
│   │   └── SensoryBars.js  # Shared rating bars + helpers
│   ├── lib/
│   │   └── supabase.js     # Supabase client
│   ├── pages/
│   │   ├── Browse.js       # Main listing page
│   │   ├── ShowDetail.js   # Individual show + reviews
│   │   ├── Auth.js         # Sign in / sign up
│   │   └── Profile.js      # User profile + my reviews
│   ├── App.js              # Routes + auth context
│   └── index.js            # Entry point
├── .env.example            # Copy to .env.local and fill in
├── SUPABASE_SETUP.sql      # Run this in Supabase SQL editor
└── package.json
```

---

## Tech stack (all free)

| Thing | Tool | Cost |
|---|---|---|
| Frontend | React | Free |
| Database | Supabase (Postgres) | Free tier |
| Auth | Supabase Auth | Free tier |
| Hosting | Vercel | Free tier |

---

Built with ❤️ to help neurodivergent people make informed decisions about live events.
