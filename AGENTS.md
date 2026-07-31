# AGENTS.md

## Architecture

- **Static-only**: `index.html` (site) + `admin.html` (dashboard). No build step, no server, no package.json, no tests. All CSS/JS is inline in each file's `<style>`/`<script>` blocks.
- **Data**: localStorage key `portfolio_data`. `DEFAULT_DATA` is defined **independently in both** `index.html:465` and `admin.html:406` and the two copies drift — edit both when changing defaults. `portfolio-data.json` (repo root) is a committed export snapshot, not read by the site.
- **Images**: Hosted in a **public Supabase Storage bucket** `images` (project `dsbrzllslpbqynuoivqx`). Base URL: `https://dsbrzllslpbqynuoivqx.supabase.co/storage/v1/object/public/images/`, referenced via the `IMG` constant in each file's script block. The local `Assert/images/` folder (capital "A") still holds the originals but the site no longer reads from it. Google Fonts, FontAwesome, and `@supabase/supabase-js@2` (admin only) load from CDNs (needs internet).
- **Deploy**: GitHub Pages (`CNAME` = `www.amitrajbanshi.com.np`). Push to `main` = deploy.

## Content publishing gotcha

- Admin edits write only to the current browser's localStorage. To change content for all visitors, update `DEFAULT_DATA` in `index.html` (and `admin.html`) and commit/push.
- Rendering is only partially data-driven: skills, services, gallery, testimonials, profile/about/contact/stats/images come from data. Hero copy, resume timeline, socials, contact map, and section subtitles are **hardcoded in `index.html`** — editing `DEFAULT_DATA` won't change them.
- Admin "Save Images" / "Add Image" uploads selected files to the Supabase bucket (via `uploadImage()`, `admin.html`) and stores the resulting public URL. Uploads require the **authenticated-insert storage policy** (see below); without it the upload fails and the old URL is kept. Content edits still write only to localStorage — commit `DEFAULT_DATA` changes to publish to all visitors.

## Supabase

- **Auth**: `admin.html` logs in via Supabase Auth (`signInWithPassword`) — credentials live in the Supabase project, not the repo. Admin account: `info@amitrajbanshi.com.np`. Anon key is hardcoded in `admin.html` (`SUPABASE_ANON_KEY`). Session checked via `getUser()` / `signOut()`.
- **Storage policy requirement**: authenticated uploads need the policies in `supabase-storage-policy.sql` (repo root) run in the Supabase SQL Editor — INSERT (uploads) plus UPDATE (for `upsert: true`) and DELETE, all scoped to the admin email. Without them the upload fails and the old URL is kept.
- Admin user / bucket / images were created with the service_role key (not stored in the repo).

## Notes

- `graphify-out/` is a generated code-graph artifact, not part of the site.
- `.opencode/` holds opencode skills/config; `.gitignore` ignores `node_modules/` and `generated/prisma` (nothing builds).
