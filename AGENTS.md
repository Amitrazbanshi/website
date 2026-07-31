# AGENTS.md

## Architecture

- **Static-only**: `index.html` (site) + `admin.html` (dashboard). No build step, no server, no package.json, no tests. All CSS/JS is inline in each file's `<style>`/`<script>` blocks.
- **Data**: localStorage key `portfolio_data`. `DEFAULT_DATA` is defined **independently in both** `index.html:397` and `admin.html:404` and the two copies drift — edit both when changing defaults. `portfolio-data.json` (repo root) is a committed export snapshot, not read by the site.
- **Images**: `Assert/images/` (capital "A", not "assets"). Google Fonts + FontAwesome load from CDNs (needs internet).
- **Deploy**: GitHub Pages (`CNAME` = `www.amitrajbanshi.com.np`). Push to `main` = deploy.

## Content publishing gotcha

- Admin edits write only to the current browser's localStorage. To change content for all visitors, update `DEFAULT_DATA` in `index.html` (and `admin.html`) and commit/push.
- Rendering is only partially data-driven: skills, services, gallery, testimonials, profile/about/contact/stats/images come from data. Hero copy, resume timeline, socials, contact map, and section subtitles are **hardcoded in `index.html`** — editing `DEFAULT_DATA` won't change them.
- Admin "Save Images" / "Add Image" only records the path `Assert/images/<filename>` and prompts you to manually copy the file into `Assert/images/`; nothing is uploaded. Gallery entries may also store base64 data URLs, which bloat localStorage.

## Admin login

- Login uses a **hardcoded credential** in `doLogin()` (`admin.html:954`). There is no "set up admin account" flow — `showRegister()` and the `portfolio_admin` key are dead code. Session flag: `admin_logged_in`.
- To change login behavior, edit the check in `doLogin()`.

## Notes

- `graphify-out/` is a generated code-graph artifact, not part of the site.
- `.opencode/` holds opencode skills/config; `.gitignore` ignores `node_modules/` and `generated/prisma` (nothing builds).
