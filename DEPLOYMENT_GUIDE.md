# OpportunityPro — Deployment Guide

Complete step-by-step guide to deploy this app online for FREE.

---

## Prerequisites (All Free)

| Service | Purpose | Sign Up |
|---|---|---|
| GitHub | Code hosting | https://github.com |
| Supabase | PostgreSQL DB + Auth | https://supabase.com |
| Vercel | App hosting | https://vercel.com |

---

## STEP 1 — Set Up Supabase

1. Go to **https://supabase.com** → Click **Start your project**
2. Sign up / Log in with GitHub
3. Click **New Project**
   - Organization: (your org)
   - Name: `opportunity-tracker`
   - Database Password: (save this!)
   - Region: Choose closest to you (e.g., `ap-south-1` for India)
   - Click **Create new project** — wait ~2 minutes

4. Once ready, go to your project → **SQL Editor** (left sidebar)
5. Click **New query**
6. **Copy the entire contents of `SUPABASE_SCHEMA.sql`** and paste it → Click **Run**
7. You should see "Success" — your tables are created!

8. Go to **Settings** → **API** (left sidebar)
   - Copy **Project URL** → looks like `https://abcdefgh.supabase.co`
   - Copy **anon public** key → long string starting with `eyJ...`

9. Go to **Authentication** → **Email** → Make sure Email confirmations is **OFF** for easy testing
   (Settings → Auth → toggle off "Enable email confirmations")

---

## STEP 2 — Push Code to GitHub

Open **Command Prompt** or **PowerShell** in your project folder and run:

```bash
cd C:\Users\B.AKAASH\Desktop\babu_dashboard

git init
git add .
git commit -m "Initial commit — OpportunityPro"
```

Then:
1. Go to **https://github.com/new**
2. Repository name: `opportunity-tracker`
3. Keep it **Public** or Private
4. Click **Create repository**
5. Copy the commands shown under "push an existing repository" and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/opportunity-tracker.git
git branch -M main
git push -u origin main
```

---

## STEP 3 — Deploy on Vercel

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **Add New Project**
3. Import your `opportunity-tracker` repository
4. Framework: **Next.js** (auto-detected)
5. **Environment Variables** — Add these two:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

6. Click **Deploy** → Wait ~2 minutes

✅ **Your app is now live!** Vercel gives you a URL like:
`https://opportunity-tracker-xyz.vercel.app`

---

## STEP 4 — Configure Supabase Auth Redirect

1. Go to Supabase → **Authentication** → **URL Configuration**
2. **Site URL**: paste your Vercel URL (e.g., `https://opportunity-tracker-xyz.vercel.app`)
3. **Redirect URLs**: Add `https://opportunity-tracker-xyz.vercel.app/auth/callback`
4. Click **Save**

---

## STEP 5 — Create Your First User

1. Open your app URL
2. Click **Sign up**
3. Enter your email and password
4. You're in! The dashboard loads automatically.

---

## Future Updates

Whenever you change code:
```bash
git add .
git commit -m "describe your change"
git push
```
Vercel auto-deploys within 1-2 minutes. ✅

---

## Local Development (Optional)

```bash
cd C:\Users\B.AKAASH\Desktop\babu_dashboard

# Install dependencies
npm install

# Run locally (need .env.local filled with Supabase keys)
npm run dev
```
Open http://localhost:3000

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Login not working | Check Supabase URL & anon key in Vercel env vars |
| Tables not found | Re-run SUPABASE_SCHEMA.sql in SQL Editor |
| Charts empty | Add opportunities first via the app |
| Auth redirect error | Check redirect URL in Supabase Auth settings |
| Build fails | Check Vercel build logs for missing env vars |
