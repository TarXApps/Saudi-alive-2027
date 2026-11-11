# LIV NEXT Saudi 2027

Website for LIV NEXT Saudi 2027 (Connect Spot Exhibitions), Riyadh, 2027.
Static HTML, CSS and JS with no build step. Hosted on Cloudflare Pages from the `main` branch.

## What is where

- `main` branch: the live seven-page website (Home, About, Sectors, Programme, Exhibit, Sponsor, Contact).
- `coming-soon/index.html`: the Coming Soon page, kept inside the site (not indexed by search engines).
- `coming-soon` branch: the same Coming Soon page as it was when it was the live home page.
- `full-site-v1` branch: the earlier website draft, kept as a backup.
- `site-v2` branch: the development branch the current site was built on.

## Switching back to the Coming Soon page

Copy `coming-soon/index.html` over `index.html` on `main`, commit and push. Cloudflare redeploys in about a minute.
To bring the full site back, restore `index.html` from the commit before the switch.
