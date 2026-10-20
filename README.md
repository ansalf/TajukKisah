# TajukKisah — Premium Digital Wedding Invitation Platform

TajukKisah is an editorial digital wedding invitation platform built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

---

## Features

- **Luxury Editorial Design System**: Warm ivory (`#F6F0E6`), rich burgundy (`#651F32`), deep espresso (`#2A151B`), and muted gold (`#C7A66A`) palette paired with Cormorant Garamond and Plus Jakarta Sans.
- **13-Section Wedding Invitation**:
  1. Opening cover with personalized guest card
  2. Hero with romantic portraiture
  3. Poetic quote & dedication
  4. Couple & family biographical profiles
  5. Live countdown clock
  6. Love story milestone timeline
  7. Ceremony & reception event details with Google Maps link
  8. Responsive interactive gallery with modal lightbox
  9. Validated RSVP response form
  10. Guest wishes & blessings live wall
  11. Digital gift & bank transfer information
  12. Graceful closing & footer
  13. User-controlled music soundtrack (no autoplay)
- **Wedding Dashboard & Studio Editor**:
  - Live 8-tab editor for bride/groom profiles, event schedules, story milestones, photo uploads, theme styling, and digital gifts.
  - Split-screen live preview with mobile/desktop viewport toggle.
- **Publishing & Sharing Workflow (Phase 6)**:
  - Custom URL-safe slug management (`/wedding/:slug`).
  - Slug conflict validation against Supabase & local records.
  - One-click Publish / Unpublish status toggles.
  - One-click copy invitation link, native Web Share API support, and WhatsApp guest invite generator.
  - Personalized guest links via URL query parameters (`?to=Guest+Name`, `?guest=...`, `?name=...`).
  - Strict privacy gating: draft/unpublished/missing weddings show an editorial "Invitation Unavailable" protective screen.
- **Supabase Integration**:
  - Email/password authentication with session persistence.
  - PostgreSQL schema with Row Level Security (RLS) policies for owner-only writes and published-only public reads.

---

## Free-Tier Deployment Guide

TajukKisah is built to deploy for free on static web hosting providers such as **Vercel**, **Netlify**, or **Cloudflare Pages**, backed by **Supabase's Free Tier**.

### 1. Environment Variables

Create `.env` (or configure in your hosting provider's dashboard):

```env
VITE_SUPABASE_URL="https://<your-project-id>.supabase.co"
VITE_SUPABASE_ANON_KEY="<your-public-anon-key>"
```

> **Security Note**: Never expose the Supabase `service_role` secret in frontend environment variables. Only use the public `anon` key.

### 2. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the migration script located at `supabase/migrations/20261020000000_tajukkisah_schema.sql`.
4. Copy your project API URL and public `anon` key into your environment variables.

### 3. Deploying to Vercel

The repository already includes `vercel.json` with SPA routing rewrites:
1. Push your code to GitHub / GitLab / Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. Set Framework Preset to **Vite**.
4. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Environment Variables**.
5. Click **Deploy**.

### 4. Deploying to Netlify

The repository includes `public/_redirects` (`/* /index.html 200`):
1. Import the repository in [Netlify](https://netlify.com).
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Deploy site.

---

## Free-Tier Operational Limits & Considerations

| Provider | Free Tier Limit | Notes |
| :--- | :--- | :--- |
| **Supabase Database** | 500 MB database space, 1 GB storage, 50,000 monthly active users (MAU) | Free projects pause after 1 week of inactivity. Simply unpause via dashboard if testing after periods of inactivity. |
| **Vercel / Netlify** | 100 GB bandwidth / month, unlimited static deployments | Ample for thousands of invitation views monthly. |
| **Storage & Photos** | Supabase Storage (1 GB) / Local or CDN assets | For photo-heavy galleries, compress images to WebP/JPEG under 1.5MB each. |

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript check
npx tsc --noEmit

# Production build test
npm run build
```
