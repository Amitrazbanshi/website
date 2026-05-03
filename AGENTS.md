# AGENTS.md

## Architecture

- **Static-only**: `index.html` + `admin.html`, no server required
- **Data storage**: localStorage (`portfolio_data` key)
- **Images**: `Assert/images/` (note casing: "Assert", not "assets")
- **Admin**: `admin.html` page

## Running

Open `index.html` or `admin.html` directly in a browser - no build/server needed.

## Admin Setup

1. Open `admin.html` in browser
2. Click "Set up admin account" link
3. Enter username/password to create admin account
4. Use credentials to login

## Manageable Content

- **Profile**: Name, role, tagline, hero subtitle
- **About**: Three paragraphs
- **Contact**: Location, email, phone, birthday, degree
- **Stats**: Clients, projects, hours, years
- **Skills/Services/Gallery/Testimonials**: Add/delete items
- **Messages**: View contact form submissions
- **Data**: Export/import/reset via admin panel