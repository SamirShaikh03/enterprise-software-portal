# Binary Solutions – Enterprise Software Portal

An interactive single-page experience for Binary Solutions that brings together marketing content, event programming, client services, and a lightweight quiz—all built with vanilla web technologies for easy hosting on any static site platform.

## Table of Contents
- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Tips](#usage-tips)
- [Customization](#customization)
- [Tech Stack](#tech-stack)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview
The portal highlights Binary Solutions' services, digital expertise, locations, and employee benefits while promoting the **Tech Innovate 2025** conference. It also includes a client access form, embedded partner content, and a short quiz to keep visitors engaged. Everything is bundled into a single HTML entry point (`Software_Company_Website/integrated.html`) that references local styles, scripts, and media assets.

## Screenshots
| Landing Page | Tech Conference Schedule | Client Access Portal |
| --- | --- | --- |
| _Add a screenshot (e.g., `assets/screenshots/hero.png`)_ | _Add a screenshot (e.g., `assets/screenshots/schedule.png`)_ | _Add a screenshot (e.g., `assets/screenshots/portal.png`)_ |

> 💡 Tip: Capture screenshots after you run the site locally, then update the table with real image paths.

## Features
- **Brand-forward hero section** with marquee hiring notice and company overview.
- **Service catalog** outlining core offerings and tech expertise with iconography from Font Awesome.
- **Conference schedule** rendered as a rich table with external registration links.
- **Digital expertise carousel-style layout** highlighting capability pillars.
- **Client access portal** with validation-ready form inputs and gender selection.
- **Embedded partner iframe** for cross-promotions.
- **Emerging technologies quiz** (`Software_Company_Website/Quiz.html`) with clear instructions.
- **Modal login & signup dialog** scaffolding for future authentication logic.

## Project Structure
```
Software_Company_Website/
├── Assets/
│   ├── Organization_icon.png
│   ├── Organization_img.jpg
│   └── Organization_logo.png
├── integrated.css
├── integrated.html      ← primary landing page
├── integrated.js        ← behaviour hooks & validation stubs
└── Quiz.html            ← standalone quiz experience

enterprise-software-portal/
├── assets/              ← shared icons & styles (optional legacy artifacts)
├── css/
├── js/
├── README.md            ← you are here
└── …
```

If you do not need the legacy `enterprise-software-portal` stub, you can keep everything under `Software_Company_Website` and treat it as the project root.

## Getting Started
1. **Clone the repository** (after you push it to GitHub):
   ```powershell
   git clone https://github.com/<your-username>/enterprise-software-portal.git
   cd enterprise-software-portal
   ```
2. **Open the workspace** in your editor of choice (VS Code recommended).
3. **Launch the site** by opening `Software_Company_Website/integrated.html` in a modern browser.

### Optional: Live Server
If you use VS Code, install the _Live Server_ extension, right-click `integrated.html`, and choose **Open with Live Server** for auto-refreshing previews.

## Usage Tips
- Use the navigation bar links to jump to on-page sections (`#services`, `#conference`, `#expertise`, etc.).
- Click **Careers** to open the external Typeform job application.
- The **Login** button triggers a modal. Validation helpers can be hooked up in `integrated.js`.
- Explore the **Quiz** via the call-to-action button at the end of the page.

## Customization
- Replace images in `Software_Company_Website/Assets/` with brand-specific media (keep the same filenames or update the HTML references).
- Update conference data directly within the `<table>` in `integrated.html`.
- Adjust colors, typography, or layout in `integrated.css`.
- Enhance interactivity—form validation, quiz scoring, or API integrations—via `integrated.js`.

## Tech Stack
- **HTML5** for semantic structure.
- **CSS3** (Flexbox, responsive layout, marquee accents).
- **Vanilla JavaScript** hooks prepared for future dynamic behaviour.
- **Font Awesome 6** CDN for icons.

## Roadmap
- [ ] Add form validation and submission handling.
- [ ] Implement client portal authentication flow.
- [ ] Persist quiz answers and display scores.
- [ ] Improve accessibility (skip links, ARIA roles, keyboard navigation).
- [ ] Provide automated tests (e.g., Playwright smoke tests).

## Contributing
1. Fork the repository and clone your fork.
2. Create a feature branch:
   ```powershell
   git checkout -b feature/amazing-improvement
   ```
3. Commit changes following conventional commits if possible.
4. Open a pull request explaining the motivation and screenshots for UI updates.

## License
This project is released under the [MIT License](LICENSE). Feel free to adapt it for your organization while retaining attribution.