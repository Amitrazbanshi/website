# AGENTS.md

## Architecture

- **Static-only**: `index.html` + `admin.html`, no server required
- **Data storage**: localStorage (browser-based, persists across sessions)
- **Images**: Stored in `Assert/images/`
- **Admin panel**: Separate `admin.html` page

## Admin Setup

1. Open `admin.html` in a browser
2. Click "Set up admin account" link
3. Enter username and password
4. Use those credentials to login

## What Can Be Managed

- **Profile**: Name, role, tagline, hero subtitle
- **About**: All three paragraphs
- **Contact**: Location, email, phone, birthday, degree
- **Stats**: Happy clients, projects, hours, years experience
- **Skills**: Add/delete skills with percentages
- **Services**: Add/delete services with icons and descriptions
- **Gallery**: Add/delete images with alt text and overlay
- **Testimonials**: Add/delete client quotes
- **Messages**: View contact form submissions
- **Data**: Export/import/reset data

## Data Management

All content stored in localStorage under key `portfolio_data`. Default data is pre-populated on first load.

## Running the Website

Simply open `index.html` in any web browser - no server needed.